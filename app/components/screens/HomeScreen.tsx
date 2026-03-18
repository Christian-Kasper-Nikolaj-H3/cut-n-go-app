import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, Divider, Text } from 'react-native-paper';
import { Link } from 'expo-router';

type PriceItem = {
    label: string;
    price: string;
    note?: string;
};

type PriceSection = {
    title: string;
    items: PriceItem[];
};

const priceSections: PriceSection[] = [
    {
        title: 'Klipning',
        items: [
            { label: 'Herre klip', price: '180,-' },
            { label: 'Dame klip', price: '250,-' },
            { label: 'Børne klip (under 12 år)', price: '170,-' },
            { label: 'Herre klip (pensionist)', price: '170,-' },
            { label: 'Dame klip (pensionist)', price: '230,-' },
        ],
    },
    {
        title: 'Permanent',
        items: [
            { label: 'Kort', price: 'Fra 550,-' },
            { label: 'Mellem', price: 'Fra 750,-' },
            { label: 'Langt', price: 'Fra 950,-' },
        ],
    },
    {
        title: 'Striber',
        items: [
            { label: 'Kort', price: 'Fra 550,-' },
            { label: 'Mellem', price: 'Fra 700,-' },
            { label: 'Langt', price: 'Fra 850,-' },
            { label: 'Hætte striber', price: 'Og op 400,-' },
        ],
    },
    {
        title: 'Helfarvning',
        items: [
            { label: 'Kort', price: '350,-' },
            { label: 'Mellem', price: '600,-' },
            { label: 'Langt', price: '700 – 1000,-' },
        ],
    },
    {
        title: 'Toning',
        items: [
            { label: 'Bund 2-3 cm', price: '350,-' },
        ],
    },
]

export function HomeScreen() {
    const name = "Cut'n'Go";
    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.heroCard}>
                    <Card.Content style={styles.heroContent}>
                        <Text variant="headlineMedium" style={styles.brand}>
                            {name}
                        </Text>
                        <Text variant="titleMedium" style={styles.welcomeText}>
                            Velkommen til din lokale frisør
                        </Text>
                        <Text variant="bodyMedium" style={styles.introText}>
                            Her møder du en hyggelig, personlig og professionel atmosfære, hvor
                            vi tager os tid til både hår, stil og gode samtaler.
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={styles.pricingCard}>
                    <Card.Content style={styles.sectionContent}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>
                            Priser
                        </Text>

                        {priceSections.map((section, sectionIndex) => (
                            <View key={section.title} style={styles.priceSection}>
                                {sectionIndex > 0 ? <Divider style={styles.divider} /> : null}

                                <Text variant="titleMedium" style={styles.priceSectionTitle}>
                                    {section.title}
                                </Text>

                                <View style={styles.priceList}>
                                    {section.items.map((item) => (
                                        <View key={`${section.title}-${item.label}`} style={styles.priceRow}>
                                            <View style={styles.priceLabelBlock}>
                                                <Text variant="bodyMedium" style={styles.priceLabel}>
                                                    {item.label}
                                                </Text>
                                                {item.note ? (
                                                    <Text variant="bodySmall" style={styles.priceNote}>
                                                        {item.note}
                                                    </Text>
                                                ) : null}
                                            </View>
                                            <Text variant="bodyMedium" style={styles.priceValue}>
                                                {item.price}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                        <View style={styles.ctaRow}>
                            <Link href="/(public)/booking" asChild>
                                <Button
                                    mode="contained"
                                    buttonColor="#be185d"
                                    textColor="#fff"
                                    style={styles.primaryButton}
                                    contentStyle={styles.buttonContent}
                                    labelStyle={styles.buttonLabel}
                                >
                                    Book tid
                                </Button>
                            </Link>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.storyCard}>
                    <Card.Content style={styles.sectionContent}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>
                            Hvem er {name}?
                        </Text>
                        <Text variant="bodyMedium" style={styles.storyText}>
                            {name} er en frisørkæde med fokus på nærvær, kvalitet og en tryg
                            oplevelse for alle kunder. Vi arbejder i mindre, lokale saloner, hvor
                            det er vigtigt, at man føler sig velkommen fra første øjeblik.
                        </Text>
                        <Text variant="bodyMedium" style={styles.storyText}>
                            Vores saloner er bemandet med engagerede frisører, som kombinerer
                            erfaring med gode vaner og et smil på læben. Vi lægger vægt på at finde
                            den løsning, der passer bedst til den enkelte kunde, uanset om det
                            handler om en enkel klipning, en ny farve eller en mere kreativ
                            behandling.
                        </Text>
                        <Text variant="bodyMedium" style={styles.storyText}>
                            Hos {name} handler det ikke kun om hår, men også om at give dig en
                            behagelig stund i stolen og et resultat, du føler dig godt tilpas med.
                            Vi tror på god service, personlig kontakt og et resultat, der passer
                            til både hverdag og stil.
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 32,
        gap: 16,
    },
    heroCard: {
        backgroundColor: '#fff',
        borderRadius: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    heroContent: {
        padding: 24,
        gap: 12,
        alignItems: 'center',
    },
    brand: {
        color: '#be185d',
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 0.4,
    },
    welcomeText: {
        color: '#52525b',
        fontWeight: '700',
        textAlign: 'center',
    },
    introText: {
        color: '#52525b',
        textAlign: 'center',
        lineHeight: 22,
    },
    ctaRow: {
        marginTop: 6,
        width: '100%',
    },
    primaryButton: {
        borderRadius: 14,
    },
    secondaryButton: {
        borderRadius: 14,
        marginTop: 4,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    storyCard: {
        backgroundColor: '#ffffff',
        borderRadius: 22,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 2,
    },
    pricingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 22,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 2,
    },
    footerCard: {
        backgroundColor: '#ffffff',
        borderRadius: 22,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionContent: {
        padding: 20,
        gap: 14,
    },
    sectionTitle: {
        color: '#be185d',
        fontWeight: '800',
    },
    storyText: {
        color: '#52525b',
        lineHeight: 22,
    },
    priceSection: {
        gap: 12,
    },
    divider: {
        backgroundColor: '#fce7f3',
    },
    priceSectionTitle: {
        color: '#9d174d',
        fontWeight: '800',
    },
    priceList: {
        gap: 10,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        paddingVertical: 4,
    },
    priceLabelBlock: {
        flex: 1,
        gap: 2,
    },
    priceLabel: {
        color: '#374151',
        fontWeight: '600',
    },
    priceNote: {
        color: '#71717a',
    },
    priceValue: {
        color: '#be185d',
        fontWeight: '800',
        textAlign: 'right',
        flexShrink: 0,
    },
    footerContent: {
        padding: 20,
        gap: 10,
        alignItems: 'flex-start',
    },
    footerTitle: {
        color: '#9d174d',
        fontWeight: '800',
    },
    footerText: {
        color: '#52525b',
        lineHeight: 22,
    },
});
