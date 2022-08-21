import React, {useState, useEffect} from 'react';
import { Platform, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import firestore from '@react-native-firebase/firestore'; //para armazenar informações da pizza
import storage from '@react-native-firebase/storage'; //para fazer upload da imagem

import { ButtonBack } from '../../components/ButtonBack';
import { Photo } from '../../components/Photo';
import { InputPrice } from '../../components/InputPrice';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ProductProps } from '../../components/ProductCard';

import { Container, Header, Title, DeleteLabel, Upload, PickImageButton, 
          Form, Label, InputGroup, InputGroupHeader, MaxCharacters} from './styles';

import { useNavigation, useRoute } from '@react-navigation/native';
import { ProductNavigationProps } from '../../@types/navigation';

type PizzaResponse = ProductProps & {
    photo_path: string;
    prices_size: {
        p: string;
        m: string;
        g: string;
    }
}

export function Product() {
    const [image,setImage] = useState('');
    const [name, setName] = useState('');
    const [photoPath, setPhotoPath] = useState('');
    const [description, setDescription] = useState('');
    const [priceSizeP, setPriceSizeP] = useState('');
    const [priceSizeM, setPriceSizeM] = useState('');
    const [priceSizeG, setPriceSizeG] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as ProductNavigationProps;

    async function handlePickerImage(){
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if(status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 4]
            });

            if (!result.cancelled) {
                setImage(result.uri);
            }
        }
    };

    async function handleAdd(){
        //verificar se está preenhendo os campos antes de salvar, o trim faz com que não aceite
        //espaços em branco.

        if(!name.trim()){
            return Alert.alert('Cadastro', 'Informe o nome da pizza');
        }

        if(!description.trim()){
            return Alert.alert('Cadastro', 'Informe a descrição da pizza');
        }

        if(!image){
            return Alert.alert('Cadastro', 'Selecione a imagem da pizza.');
        }

        if(!priceSizeP || !priceSizeM || !priceSizeG){
            return Alert.alert('Cadastro', 'Informe o tamanho e preço da pizza.');
        }

        setIsLoading(true);
        //fazendo upload das imagens

        const fileName = new Date().getTime();
        const reference = storage().ref(`/pizzas/${fileName}.png`);
        
        await reference.putFile(image);
        const photo_url = await reference.getDownloadURL();

        firestore()
        .collection('pizzas')
        .add({
            name,
            name_insensitive: name.toLowerCase().trim(),
            description,
            prices_size: {
                p: priceSizeP,
                m: priceSizeM,
                g: priceSizeG
            },
            photo_url,
            photo_path: reference.fullPath
        })
        .then(() => navigation.navigate('home'))
        .catch(()=> {
            setIsLoading(false);
            Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.')
        })
    };

    function handleGoBack(){
        navigation.goBack();
        console.log("oi")
    };

    function handleDelete(){
        firestore()
        .collection('pizzas')
        .doc(id)
        .delete()
        .then(()=>{
            storage()
            .ref(photoPath)
            .delete()
            .then(()=> navigation.navigate('home'));
        });
    };

    //verifica se id vazio ou não, se não estiver ele carrega com as informações passadas
    useEffect(() => {
        if (id) {
            firestore()
            .collection('pizzas')
            .doc(id)
            .get()
            .then(response => {
                const product = response.data() as PizzaResponse;

                setName(product.name);
                setImage(product.photo_url);
                setDescription(product.description);
                setPriceSizeP(product.prices_size.p);
                setPriceSizeM(product.prices_size.m);
                setPriceSizeG(product.prices_size.g);
                setPhotoPath(product.photo_path);
            })
        }
    }, []);


    return (
        <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
            <ScrollView>
                <Header>
                    <ButtonBack onPress={handleGoBack} />
                    <Title>Cadastrar</Title>

                    { id ?
                        <TouchableOpacity onPress={handleDelete}>
                            <DeleteLabel>Deletar</DeleteLabel>
                        </TouchableOpacity>
                        : <View style={{width: 20}} />
                    }

                </Header>

                <Upload>
                    <Photo uri={image} />
                    {!id &&
                        <PickImageButton title="Carregar" type="secondary" onPress={handlePickerImage} />
                    }    
                </Upload>

                <Form>
                    <InputGroup>
                        <Label>Nome</Label>
                        <Input 
                            onChangeText={setName}
                            value={name}
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputGroupHeader>
                            <Label>Descrição</Label>
                            <MaxCharacters> 0 de 60 caracteres </MaxCharacters>
                        </InputGroupHeader>

                        <Input 
                            multiline
                            maxLength={60}
                            style={{height: 80}}
                            onChangeText={setDescription}
                            value={description}
                        />
                    </InputGroup>


                    <InputGroup>
                        <Label>Tamanho e Preços</Label>
                        <InputPrice 
                            size="P" 
                            onChangeText={setPriceSizeP}
                            value={priceSizeP}
                        />
                        <InputPrice 
                            size="M" 
                            onChangeText={setPriceSizeM}
                            value={priceSizeM}
                        />
                        <InputPrice 
                            size="G"
                            onChangeText={setPriceSizeG}
                            value={priceSizeG}
                        />
                    </InputGroup>

                    { !id &&
                    <Button 
                        title='Cadastrar Pizza'
                        isLoading={isLoading}
                        onPress={handleAdd}
                    />
                    }

                </Form>
            </ScrollView>

        </Container>
    )
}