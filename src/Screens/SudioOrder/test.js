{
    cartData.length === 0 && (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            marginHorizontal: '10%',
            alignItems: 'center'
        }}>
            <Image />
            <Text style={{
                color: 'white',
                fontFamily: fonts.AvenirNextCondensedBold,
                fontSize: RFValue(30)
            }}>Your Cart Is Empty!</Text>
            <Text style={{
                color: 'white',
                fontFamily: fonts.AvenirNextCondensedMediumItalic,
                fontSize: RFValue(16),
                textAlign: 'center'
            }}>Before proceed to checkout you must add some products to your cart.</Text>
        </View>)
}