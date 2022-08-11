import React, {useContext, createContext, useState, ReactNode, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    id: string;
    name: string;
    isAdmin: boolean;
}

type AuthContextData = {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    forgotPassword: (email: string) => Promise<void>;
    isLoggin: boolean;
    user: User | null;
};

type AuthProviderProps = {
    children: ReactNode;
};

const USER_COLLECTION = '@gopizza:users';

export const AuthContext = createContext({} as AuthContextData);


    function AuthProvider({children}: AuthProviderProps) {
        
        const [user, setUser] = useState<User | null>(null);
        const [isLoggin, setIsLoggin] = useState(false);


        async function signIn(email: string, password:string){
            if (!email || !password) {
                return Alert.alert('Login', 'Informe e-mail e senha')
            }
            setIsLoggin(true);
    
            auth().signInWithEmailAndPassword(email,password)
            .then(account=> {
                firestore()
                .collection('users')
                    .doc(account.user.uid)
                    .get()
                    .then(async profile => {
                        const { name, isAdmin } = profile.data() as User;

                        if (profile.exists) {
                            const userData = {
                                id: account.user.uid,
                                name,
                                isAdmin
                            }
                            await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userData));
                            setUser(userData);
                        }
                    })
                    .catch(() => Alert.alert('Login', 'Não foi possível buscar os dados do usuario'));
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
        };

        async function loadUserStorageData(){
            setIsLoggin(true);
            const storedUser = await AsyncStorage.getItem(USER_COLLECTION);

            if(storedUser) {
                const userData = JSON.parse(storedUser) as User;
                setUser(userData);
            }

            setIsLoggin(false);
        };

        async function signOut() {
            await auth().signOut();
            await AsyncStorage.removeItem(USER_COLLECTION);
            setUser(null);
        };

        async function forgotPassword(email: string) {
            if(!email) {
                return Alert.alert('Redefinir senha', "informe o e-mail");
            }

            auth()
            .sendPasswordResetEmail(email)
            .then(() => Alert.alert('Redefinir senha', 'Enviamos um link no seu e-mail para redefinir sua senha'))
            .catch(()=> Alert.alert('Redefinir senha', 'Não foi possível enviar o e-mail para redefinir sua senha'));
        };

        useEffect(() => {
            loadUserStorageData();
        },[]);

        return(
            <AuthContext.Provider value={{signIn, signOut, isLoggin, user, forgotPassword}}>
                {children}
            </AuthContext.Provider>
        )
    }

    function useAuth(){
        const context = useContext(AuthContext);
        return context;
    }

export { AuthProvider, useAuth };