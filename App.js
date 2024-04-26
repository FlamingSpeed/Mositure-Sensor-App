import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
  const [moistureSensorActivated, setMoistureSensorActivated] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState('Plant A');
  const [moistureLevels, setMoistureLevels] = useState({
    'Plant A': 40,
    'Plant B': 60,
    'Plant C': 30,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showSprayMessage, setShowSprayMessage] = useState(false);
  const [presetTimes, setPresetTimes] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [showSetTimeMessage, setShowSetTimeMessage] = useState(false); // Added state variable

  const toggleMoistureSensor = () => {
    setMoistureSensorActivated(!moistureSensorActivated);
  };

  const handlePlantChange = (plant) => {
    setSelectedPlant(plant);
  };

  const handleAddPlant = () => {
    setModalVisible(true);
  };

  const addPlant = () => {
    if (newPlantName) {
      setLoading(true);
      setTimeout(() => {
        setMoistureLevels({ ...moistureLevels, [newPlantName]: 0 });
        setLoading(false);
        setSelectedPlant(newPlantName);
        setModalVisible(false);
      }, 5000);
    }
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setSidebarOpen(false);
    });
  };

  const sprayWater = () => {
    setShowSprayMessage(true);
    setTimeout(() => {
      setShowSprayMessage(false);
    }, 5000);
  };

  const handlePresetTime = () => {
    setShowPresetInput(true);
  };

  const setPresetTime = () => {
    setShowPresetInput(false);
    // You can update the preset times logic here
  };

  const useSetTime = () => {
    setShowSetTimeMessage(true);
    setTimeout(() => {
      setShowSetTimeMessage(false);
    }, 5000);
    // Logic for setting default time
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>FitPlant</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={sidebarOpen ? closeSidebar : openSidebar}>
          <Icon name={sidebarOpen ? 'close' : 'menu'} size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.moistureContainer}>
          <Text style={styles.moistureLabel}>Moisture Level</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                {
                  height: `${moistureLevels[selectedPlant]}%`,
                  width: '100%', // Change the width to fill the entire container
                  bottom: 0,
                  left: 0,
                },
              ]}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={sprayWater}>
            <Text style={styles.buttonText}>Spray Water</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePresetTime}>
            <Text style={styles.buttonText}>Preset Time</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={useSetTime}>
            <Text style={styles.buttonText}>Use Set Time</Text>
          </TouchableOpacity>
        </View>
      </View>
      {sidebarOpen && (
        <Animated.View
          style={[
            styles.sidebar,
            {
              right: sidebarAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -200],
              }),
            },
          ]}>
          <Text style={styles.sidebarHeader}>Select Plant</Text>
          {Object.keys(moistureLevels).map((plant) => (
            <TouchableOpacity
              key={plant}
              style={[
                styles.plantItem,
                selectedPlant === plant && styles.selectedPlant,
              ]}
              onPress={() => handlePlantChange(plant)}>
              <Text style={styles.plantItemText}>{plant}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addPlantButton}
            onPress={handleAddPlant}>
            <Text style={styles.addPlantButtonText}>Add Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarCloseButton}
            onPress={closeSidebar}>
            <Text style={styles.sidebarCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter the name of the plant:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewPlantName(text)}
            value={newPlantName}
            placeholder="Plant name"
          />
          <TouchableOpacity style={styles.addButton} onPress={addPlant}>
            <Text style={styles.addButtonText}>Add Plant</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Connecting to sensor...</Text>
        </View>
      )}
      {showSprayMessage && (
        <View style={styles.sprayMessageContainer}>
          <Text style={styles.sprayMessageText}>Water has been sprayed!</Text>
        </View>
      )}
      {showPresetInput && (
        <View style={styles.presetInputContainer}>
          <TextInput
            style={styles.presetInput}
            onChangeText={(text) => setPresetTimes(text)}
            value={presetTimes}
            placeholder="Enter times per day"
          />
          <TouchableOpacity
            style={styles.setPresetButton}
            onPress={setPresetTime}>
            <Text style={styles.setPresetButtonText}>Set Times</Text>
          </TouchableOpacity>
        </View>
      )}
      {showSetTimeMessage && (
        <View style={styles.setTimeMessageContainer}>
          <Text style={styles.setTimeMessageText}>
            Water will be automatically sprayed 3 times a day.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#007BFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuButton: {
    padding: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  sidebarHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plantItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  plantItemText: {
    fontSize: 16,
    color: 'black',
  },
  addPlantButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  addPlantButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sidebarCloseButton: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  sidebarCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 40,
    zIndex: 0,
  },
  moistureContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  moistureLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressBar: {
    backgroundColor: '#ddd',
    height: 200,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    backgroundColor: '#007BFF',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 0, // Decreased padding
    paddingHorizontal: 10,
  },

  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  loadingText: {
    fontSize: 20,
    color: '#fff',
  },
  sprayMessageContainer: {
  position: 'absolute',
  top: '50%',
  left: '23%',
  transform: [{ translateX: -50 }, { translateY: -50 }],
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  padding: 20,
  borderRadius: 10,
  zIndex: 2,
  width: '80%', // Limit width to 80% of the screen width
  alignItems: 'center', // Center horizontally
  justifyContent: 'center', // Center vertically
},




  sprayMessageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  presetInputContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  presetInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  setPresetButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  setPresetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedPlant: {
    backgroundColor: '#f0f0f0',
  },
  setTimeMessageContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    zIndex: 2,
    alignItems: 'center',
  },

  setTimeMessageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
