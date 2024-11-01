import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const TaskList = ({ data, handleDelete }) => {
  return (
    <Animatable.View style={styles.container} animation={"bounceIn"} useNativeDriver>
      <TouchableOpacity onPress={() => handleDelete(data)}>
        <Ionicons name="checkmark-circle-sharp" size={35} color={'#121212'}/>
      </TouchableOpacity>
      <View>
        <Text style={styles.task}>
          {data.task}
        </Text>
        <Text style={styles.details}>
          Cliente: {data.clientName}
        </Text>
        <Text style={styles.details}>
          Descrição: {data.description}
        </Text>
        <Text style={styles.details}>
          Recebimento: {data.receiveDate}
        </Text>
        <Text style={styles.details}>
          Entrega: {data.deliveryDate}
        </Text>
        <Text style={styles.details}>
          Valor: {data.value}
        </Text>
      </View>
    </Animatable.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 7,
    padding: 7,
    elevation: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3
    }
  },
  task: {
    fontSize: 20, 
    color: '#121212', 
    paddingLeft: 10,
    paddingRight: 20,
    marginBottom: 10
  },
  details: {
    fontSize: 16, 
    color: '#121212', 
    paddingLeft: 10,
    paddingRight: 20,
    marginBottom: 10  // Adicionando margem inferior para criar espaçamento
  }
});

export default TaskList;