import { useSignUp } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import FlashMessage, { showMessage } from "react-native-flash-message"

export default function SignUpScreen(){
    const {isLoaded,signUp,setActive}=useSignUp() 
    const router = useRouter()
    const[emailAddress,setEmailAddress]=useState(" ")
    const[password,setPassword]=useState(" ")
    const[pendingVerification,setPendingVerification]=useState(false)
    const[code,setCode]=useState(" ")
    const[loading,setLoading]=useState(false)
     
    //handles signUp on press 

    const onSignUpPress=async()=>{
        if(!isLoaded){
            return 
        }

        if(!emailAddress || !password){
            showMessage({
                message:"Missing Fields",
                description: "Please enter both email and password",
                type:"danger",
            })
            return
        } 
         setLoading(true) 

         try {
            await signUp.prepareEmailAddressVerification({strategy:"email_code"})
            setPendingVerification(true)
            showMessage({
                message:"Verification Required",
                description:"We send you verification code via email",
                type:"info",
            })
         } catch (error:any) {
            showMessage({
                message:"SignUp Failed",
                description:error.errors?.[0]?.message || "something went wrong",
                type:"danger",
            })
            console.error(JSON.stringify(error))
         }
         finally{setLoading(false)}    
    } 

    //handle submission of verification code

    const onVerifyPress=async()=>{
        if(!isLoaded){
            return 
        }
        if(!code){
            showMessage({
                message:"Missing Code",
                description: "Please enter the verification code",
                type:"warning",
            })
            return
        }
        
        try {
            const signUpAttempt=await signUp.attemptEmailAddressVerification({code})
            if(signUpAttempt.status=="complete"){
                await setActive({session:signUpAttempt.createdSessionId})
            
            showMessage({
                message:"Welcome!",
                description:"Your Account is Created Successfully!",
                type:"success",
            })
            router.replace("/")
        }else{
            console.error(JSON.stringify(signUpAttempt))
        }

         } catch (error:any) {
            showMessage({
                message:"Verification Failed",
                description:error.errors?.[0]?.message || "invalid or expired code",
                type:"danger",
            })
            console.error(JSON.stringify(error,null,2))
         } 
    }

    //verify code 
    if(pendingVerification){
        return(
            <View style={styles.container}>
                <Text style={styles.headings}>Verify your Email!</Text>
                <TextInput value={code} placeholder="enter verification code" placeholderTextColor="#999" 
                onChangeText={setCode} style={styles.input} keyboardType="number-pad"/>
                <TouchableOpacity style={[styles.button,loading && {backgroundColor:"#999"}]} onPress={onVerifyPress} disabled={loading}>
                <Text style={styles.buttonText}>{loading?"verifying":"verify"}</Text>
                </TouchableOpacity>

                <FlashMessage position="top"/>
              
            </View>

        )
    }
    
    //redirect user to the next screen
    return(
        <View style={styles.container}>
            <Text style={styles.headings}>Sign Up</Text>
            <TextInput autoCapitalize="none" value={emailAddress} placeholder="enter email" placeholderTextColor="#999" 
             style={styles.input} keyboardType="email-address" onChangeText={setEmailAddress}/>

               <TextInput autoCapitalize="none" value={password} placeholder="enter password" placeholderTextColor="#999" 
             style={styles.input} onChangeText={setPassword}/>

               <TouchableOpacity style={[styles.button,loading && {backgroundColor:"#999"}]} onPress={onSignUpPress} disabled={loading}>
                <Text style={styles.buttonText}>{loading?"SigningUp....":"SignUp"}</Text>
                </TouchableOpacity>
                <View style={styles.footer}> 
                    <Text style={{color:"#555"}}>already have an account</Text>
                    <Link href="/sign-in" style={styles.link}>
                    <Text style={styles.linkText}>Sign In</Text>
                    </Link>
                </View>
                <FlashMessage position="top" />

        </View>
    )
    

}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        padding:20,
        backgroundColor:"#f9fafb",
    },
    headings:{
        fontSize:28,
        fontWeight:"bold",
        marginBottom:30,
        textAlign:"center",
        color:"#333",
    },
    input:{
        width:"100%",
        padding:15,
        borderColor:"#ccc",
        borderRadius:10,
        marginBottom:15,
        backgroundColor:"#fff",
        fontSize:16,
    },
    button:{
        backgroundColor:"black",
        padding:15,
        borderRadius:10,
        alignItems:"center",
        width:"100%",
        marginTop:5,
    },
    buttonText:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold",
    },
    footer:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:15,
    },
    link:{
        marginLeft:5,

    },
    linkText:{
        color:"blue",
        fontWeight:"bold",
    },



})
