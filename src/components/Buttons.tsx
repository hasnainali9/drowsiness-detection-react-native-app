import { Colors } from '../constants/index';
import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'

interface ButtonsProps {
    on_press: () => void; // Define the type for on_press function
    btn_text: string; // Define the type for btn_text as string
  }
  
const Buttons: React.FC<ButtonsProps> = ({ on_press, btn_text }) => {
  
    return (
        <TouchableOpacity style={{marginLeft:'auto',marginRight:'auto',justifyContent:'center',width:'95%',backgroundColor:Colors.primary,height:50,marginBottom:30,borderRadius:10}} 
        onPress={on_press}
        >
            <Text style={{fontSize:15,letterSpacing:1.5,textAlign:'center',position:'relative',fontFamily:'OpenSans-SemiBold',color:Colors.white}} >{btn_text}</Text>


        </TouchableOpacity>
    )
}

export default Buttons

const styles = StyleSheet.create({})