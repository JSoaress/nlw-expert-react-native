import { Alert, ScrollView, Text, View, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5535999734616"

export default function Cart() {
    const [address, setAddress] = useState("")
    const navigation = useNavigation()
    const cartStore = useCartStore()

    const total = cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0)

    function handleProductRemove(product: ProductCartProps) {
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
            { text: "Cancelar" },
            { text: "Remover", onPress: () => cartStore.remove(product.id) },
        ])
    }

    function handleOrder() {
        if(address.trim().length === 0) return Alert.alert("Pedido", "Informe os dados da entrega.")
        const products = cartStore.products.map(({ title, quantity}) => `${quantity}x ${title}`)
        const message = `🍔NOVO PEDIDO🍔\n\nEntregar em: ${address}\n\n${products.join("\n")}\n\nValor total: ${formatCurrency(total)}`
        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)
        cartStore.clear()
        navigation.goBack()
    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu carrinho" />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} extraHeight={100}>
                <ScrollView>
                    <View className="flex-1 p-5">
                        {cartStore.products.length > 0 ? (
                            <View>
                                {cartStore.products.map((product) => (
                                    <Product key={product.id} data={product} onPress={() => handleProductRemove(product)}  />
                                ))}
                            </View>
                        ) : (
                            <Text className="font-body text-slate-400 text-center my-8">Seu carrinho está vazio.</Text>
                        )}
                        <View className="flex-row gap-2 items-center ml-3 mt-5 mb-4">
                            <Text className="text-white text-xl font-subtitle">Total:</Text>
                            <Text className="text-lime-400 text-2xl font-heading">{formatCurrency(total)}</Text>
                        </View>
                        <Input 
                            placeholder="Informe o endereço de entrega" 
                            onChangeText={setAddress} 
                            blurOnSubmit={true} 
                            onSubmitEditing={handleOrder}
                            returnKeyType="next"
                        />
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
            <View className="p-5 gap-5">
                <Button onPress={handleOrder}>
                    <Button.Text>Enviar pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20} />
                    </Button.Icon>
                </Button>
                <LinkButton title="Voltar ao cardápio" href="/" />
            </View>
        </View>
    )
}