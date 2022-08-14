import React, {useState} from 'react';
import { Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import firestore from '@react-native-firebase/firestore'; //para armazenar informações da pizza
import storage from '@react-native-firebase/storage'; //para fazer upload da imagem

import { ButtonBack } from '../../components/ButtonBack';
import { Photo } from '../../components/Photo';
import { InputPrice } from '../../components/InputPrice';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { Container, Header, Title, DeleteLabel, Upload, PickImageButton, 
          Form, Label, InputGroup, InputGroupHeader, MaxCharacters} from './styles';

export function Product() {
    const [image,setImage] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priceSizeP, setPriceSizeP] = useState('');
    const [priceSizeM, setPriceSizeM] = useState('');
    const [priceSizeG, setPriceSizeG] = useState('');
    const [isLoading, setIsLoading] = useState(false);


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
        .then(() => Alert.alert('Cadastro', 'Pizza cadastrada com sucesso.'))
        .catch(()=> Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.'))

        setIsLoading(false);
    };


    return (
        <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
            <ScrollView>
                <Header>
                    <ButtonBack />
                    <Title>Cadastrar</Title>
                    <TouchableOpacity>
                        <DeleteLabel>Deletar</DeleteLabel>
                    </TouchableOpacity>
                </Header>

                <Upload>
                    <Photo uri={image} />
                    <PickImageButton title="Carregar" type="secondary" onPress={handlePickerImage} />
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
                </Form>

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

                <Button 
                    title='Cadastrar Pizza'
                    isLoading={isLoading}
                    onPress={handleAdd}
                />

            </ScrollView>

        </Container>
    )
}