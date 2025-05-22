import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from "../constants/Colors";

export default function DiarySelectionModal({ visible, onClose, onSelect }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalcontainer}>
          <Text style={styles.modalTitle}>다이어리 선택</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, styles.textDiaryButton]}
              onPress={() => onSelect('text')}
            >
              <View style={[styles.iconContainer, styles.textIconContainer]}>
                <Icon name="edit-2" size={24} color="#687076" />
              </View>
              <Text style={styles.optionText}>텍스트 다이어리</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, styles.voiceDiaryButton]}
              onPress={() => onSelect('audio')}
            >
              <View style={[styles.iconContainer, styles.voiceIconContainer]}>
                <Icon name="mic" size={24} color="#687076" />
              </View>
              <Text style={styles.optionText}>음성 다이어리</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.cancelbutton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalcontainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    alignItems: 'center',
  },
  textDiaryButton: {
    backgroundColor: Colors.subPrimary,
  },
  voiceDiaryButton: {
    backgroundColor: Colors.subPrimary,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 30,
    marginBottom: 8,
  },
  textIconContainer: {
    backgroundColor: 'white',
  },
  voiceIconContainer: {
    backgroundColor: 'white',
  },
  optionText: {
    fontWeight: '500',
  },
  cancelbutton: {
    marginTop: 10,
    padding: 10,
  },
  cancelText: {
    color: '#666',
    fontWeight: '500',
  },
});