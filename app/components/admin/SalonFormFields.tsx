import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';

export type SalonFormState = {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
};

type SalonFormFieldsProps = {
    value: SalonFormState;
    onChange: (patch: Partial<SalonFormState>) => void;
};

export function SalonFormFields({value, onChange}: SalonFormFieldsProps) {
    return (
        <View style={styles.form}>
            <TextInput label="Navn" mode="outlined" value={value.name} onChangeText={(text) => onChange({name: text})}/>
            <TextInput label="Adresse" mode="outlined" value={value.address} onChangeText={(text) => onChange({address: text})}/>
            <TextInput label="By" mode="outlined" value={value.city} onChangeText={(text) => onChange({city: text})}/>
            <TextInput label="Telefon" mode="outlined" value={value.phone} onChangeText={(text) => onChange({phone: text})}/>
            <TextInput label="Email" mode="outlined" value={value.email} onChangeText={(text) => onChange({email: text})}/>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 12,
    },
});
