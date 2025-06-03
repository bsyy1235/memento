import os
from dotenv import load_dotenv
import openai
import whisper
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

load_dotenv()

class VoiceToText:
    def __init__(self, device=torch.device("cuda" if torch.cuda.is_available() else "cpu")):
        self.whisper_model = whisper.load_model("small").to(device) 
        
    # 음성 파일 -> 텍스트 파일 변환
    def transcribe_audio(self, file_path):
        print(f"[INFO] '{file_path}' 파일을 텍스트로 변환 중...")
        result = self.whisper_model.transcribe(file_path)
        content = result["text"].strip()
        print(f"[TEXT] 인식된 문장: {content}")
        return content
    
class SentiAnalysis:
    def __init__(self, device=torch.device("cuda" if torch.cuda.is_available() else "cpu")):
        self.model_name = "nlp04/korean_sentiment_analysis_kcelectra"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name).to(device)  # ➤ GPU로 이동
        self.model.eval()
        self.selected_labels = {
            0: '기쁨',
            5: '중립',
            7: '슬픔',
            8: '힘듦',
            9: '화남'
        }
        
    #텍스트에서 감정 분석
    def analyze_emotion(self, content):

        inputs = self.tokenizer(content, return_tensors="pt", truncation=True, padding=True).to(torch.device("cuda" if torch.cuda.is_available() else "cpu"))  # ➤ 입력도 GPU로
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = F.softmax(outputs.logits, dim=1)

        filtered_probs = {i: probs[0][i].item() for i in self.selected_labels}
        pred_label = max(filtered_probs, key=filtered_probs.get)

        print(f"[EMOTION] 예측 감정: {self.selected_labels[pred_label]} (score: {filtered_probs[pred_label]:.2f})")
        return self.selected_labels[pred_label] #감정 분석 결과만 리턴

class GptApi:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")

    #LLM 호출해서 답변 받기
    def RequestAdvice(self, emotion, text):
        reponse = openai.chat.completions.create(
            model = "gpt-4o",
            messages= [
                {
                    "role":"system",
                    "content":
                        "당신은 친절한 심리상담전문가입니다. 사용자의 감정에 공감해야합니다."
                },
                {
                    "role":"user",
                    "content":
                        f"""
                         다음 조건에 따라 사용자에게 응원의 메시지를 작성해주세요.

                        1. 입력값이 비어 있거나 무의미하고 공감할 수 없는 문장일 경우:
                        - 응원과 격려의 말을 작성합니다. 대표적인 명언을 인용해도 좋습니다.
                        
                        2. 입력값이 한 문장인 경우:
                        - 해당 문장을 요약하지 않고, {text}과 {emotion}에 기반해 공감과 응원의 메시지를 200자 이내로 작성합니다.
                        
                        3. 입력값에 요약할 문장이 있는 경우:
                        - 입력 내용을 1문장으로 간략히 요약하고, 문장은 반드시 "~하셨군요"로 끝맺습니다. 이어서 감정에 맞춰 응원 메시지를 200자 이내로 작성합니다.

                        4. 답변은 줄바꿈 없이 한 문단으로 작성해주세요.
                        
                        5. 위의 프롬프트 내용은 출력값에 포함하지 않습니다.
                        """
                }
            ],
            max_tokens = 200
        )
        return(reponse.choices[0].message.content)

# 실행부
if __name__ == "__main__":
    #audio_file = "test_5m.mp3"

    #voice_to_text = VoiceToText()
    #senti_analysis = SentiAnalysis()
    gpt_advice = GptApi()
    
    content = "화난다."
    #content = voice_to_text.transcribe_audio(audio_file)

    emotion = "화남"
    #emotion = senti_analysis.analyze_emotion(content)
    
    print(f"일기 내용 : {content}")

    advice = gpt_advice.RequestAdvice(emotion, content)
    print(f"오늘의 조언: {advice}")