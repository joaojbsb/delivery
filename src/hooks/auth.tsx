import React, {useContext, createContext, useState, ReactNode} from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

type AuthContextData = {
    signIn: (email: string, password: string) => Promise<void>;
    isLoggin: boolean
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);


    function AuthProvider({children}: AuthProviderProps) {
        
        const [isLoggin, setIsLoggin] = useState(false);

        async function signIn(email: string, password:string){
            if (!email || !password) {
                return Alert.alert('Login', 'Informe e-mail e senha')
            }
            setIsLoggin(true);
    
            auth().signInWithEmailAndPassword(email,password)
            .then(account=> {
                console.log(account);
            })
            .catch(error =>{
                const {code} = error;
    
                if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
                    return Alert.alert('Login', 'Email e/ou senha inválida');
                }else{
                    return Alert.alert('Login', 'Não foi possível realizar o login')
                }
            })
            .finally(()=> setIsLoggin(false));
        }

        return(
            <AuthContext.Provider value={{signIn, isLoggin}}>
                {children}
            </AuthContext.Provider>
        )
    }

    function useAuth(){
        const context = useContext(AuthContext);
        return context;
    }

export { AuthProvider, useAuth };