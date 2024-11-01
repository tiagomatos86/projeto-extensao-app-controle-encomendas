import React, {useState, useCallback, useEffect} from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';
import TaskList from "./src/components/TaskList";
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function App() {
  const [task, setTask] = useState([]);
  const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [receiveDate, setReceiveDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [value, setValue] = useState('');
  const [isReceiveDatePickerVisible, setReceiveDatePickerVisibility] = useState(false);
  const [isDeliveryDatePickerVisible, setDeliveryDatePickerVisibility] = useState(false);

  //busca ao iniciar
  useEffect(()=> {
    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem('@task');
      if(taskStorage) {
        setTask(JSON.parse(taskStorage));
      }
    }
    loadTasks();
  }, [])

  //salvando
  useEffect(()=> {
    async function saveTasks() {
      await AsyncStorage.setItem('@task', JSON.stringify(task));
    }
    saveTasks();
  }, [task]);

  const handleAdd = () => {
    if(clientName === '' || description === '' || value === '') return;
    const data = {
      key: Math.random().toString(36).substr(2, 9),  // Gera uma key única
      clientName,
      description,
      receiveDate: receiveDate.toLocaleDateString(),  // Convertendo para string
      deliveryDate: deliveryDate.toLocaleDateString(),  // Convertendo para string
      value
    }
    setTask([...task, data]);
    setOpen(false);
    setClientName('');
    setDescription('');
    setReceiveDate(new Date());
    setDeliveryDate(new Date());
    setValue('');
  }
  

  const handleDelete = useCallback((data) => {
    const find = task.filter(r => r.key !== data.key);
    setTask(find);
  });

  const showReceiveDatePicker = () => {
    setReceiveDatePickerVisibility(true);
  };

  const hideReceiveDatePicker = () => {
    setReceiveDatePickerVisibility(false);
  };

  const handleReceiveDateConfirm = (date) => {
    setReceiveDate(date);
    hideReceiveDatePicker();
  };

  const showDeliveryDatePicker = () => {
    setDeliveryDatePickerVisibility(true);
  };

  const hideDeliveryDatePicker = () => {
    setDeliveryDatePickerVisibility(false);
  };

  const handleDeliveryDateConfirm = (date) => {
    setDeliveryDate(date);
    hideDeliveryDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#1171d3' barStyle='light-content'/>
      <View style={styles.content}>
        <Text style={styles.title}>Minhas Encomendas</Text>
      </View>
      <FlatList 
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({item}) => <TaskList data={item} handleDelete={handleDelete} />}
      />
      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons style={{marginLeft: 5, marginRight: 5}} name="arrow-back-sharp" size={40} color={"#fff"}/>
            </TouchableOpacity>
            <Text style={styles.modalTitle}> Nova Tarefa</Text>
          </View>
          <Animatable.View style={styles.modalBody} animation={"fadeInUp"} useNativeDriver>
            <TextInput
              placeholder="Nome do Cliente"
              placeholderTextColor={'#747979'}
              style={styles.input}
              value={clientName}
              onChangeText={(texto) => setClientName(texto)}
            />
            <TextInput
              placeholder="Descrição da Encomenda"
              placeholderTextColor={'#747979'}
              multiline={true} 
              utoCorrect={false} 
              style={styles.inputDescription}
              value={description}
              onChangeText={(texto) => setDescription(texto)}
            />
            <View style={styles.dateContainer}>
              <TouchableOpacity onPress={showReceiveDatePicker} style={styles.dateInput}>
                <Text style={styles.dateText}>Recebimento: {receiveDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={showDeliveryDatePicker} style={styles.dateInput}>
                <Text style={styles.dateText}>Entrega: {deliveryDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isReceiveDatePickerVisible}
              mode="date"
              onConfirm={handleReceiveDateConfirm}
              onCancel={hideReceiveDatePicker}
            />
            <DateTimePickerModal
              isVisible={isDeliveryDatePickerVisible}
              mode="date"
              onConfirm={handleDeliveryDateConfirm}
              onCancel={hideDeliveryDatePicker}
            />
            <TextInput
              placeholder="Valor"
              placeholderTextColor={'#747979'}
              style={styles.input}
              value={value}
              onChangeText={(texto) => setValue(texto)}
            />
            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handledAddText}> Cadastrar </Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>
      <AnimatedBtn style={styles.fab} useNativeDriver animation={"bounceInUp"} duration={1500} onPress={() => setOpen(true)}>
        <Ionicons name="add" size={35} color='#fff'/>
      </AnimatedBtn>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171d31',
  },
  content: {},
  title: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    fontWeight:'bold',
    textAlign: 'center',
    color: '#fff'
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 3,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3
    }
  },
  modal: {
    flex: 1,
    backgroundColor: '#171d31'
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 25,
    color: '#FFF'
  },
  modalBody: {
    marginTop: 15
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 9,
    height: 50,
    color: '#000',
    borderRadius: 5
  },

  inputDescription: {
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 9, 
    height: 100,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 9,
    marginHorizontal: 5
  },
  dateText: {
    color: '#000',
    fontSize: 18
  },
  handleAdd: {
    backgroundColor: '#0094ff',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 40
  },
  handledAddText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  }
});
