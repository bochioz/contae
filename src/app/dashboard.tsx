import CardSaldo from "@/app/components/CardSaldo";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

interface Transacao {
    id: number;
    descricao: string;
    valor: string | number;
    tipo: 'receita' | 'despesa';
    categoria: string;
    data: string;
}

export default function App() {
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [saldo, setSaldo] = useState<number>(0);
    const [receitas, setReceitas] = useState<number>(0);
    const [despesas, setDespesas] = useState<number>(0);

    const API_URL = 'http://10.141.246.77:8000/api/transacao';

    function calcularTotais(dados: Transacao[]): void {
        let totalReceitas = 0;
        let totalDespesas = 0;

        dados.forEach((item) => {
            const valorNumerico = typeof item.valor === 'number' ? item.valor : parseFloat(item.valor);
            if (item.tipo === 'receita') {
                totalReceitas += valorNumerico;
            } else {
                totalDespesas += valorNumerico;
            }
        });
        setReceitas(totalReceitas);
        setDespesas(totalDespesas);
        setSaldo(totalReceitas - totalDespesas);
    }

    async function carregarTransacoes(): Promise<void> {
        try {
            setCarregando(true);
            const resposta = await fetch(API_URL);
            const dados: Transacao[] = await resposta.json();
            setTransacoes(dados);
            calcularTotais(dados);
        } catch (error) {
            console.log('Erro ao carregar lançamentos:', error);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarTransacoes();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.cardSaldo}>
                <Text style={styles.labelSaldo}>Saldo Total</Text>
                <Text style={styles.valorSaldo}>R$ {saldo.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
                <CardSaldo titulo="Receitas" valor={`R$ ${receitas.toFixed(2)}`} corFundo="1B5E20" />
                <CardSaldo titulo="Despesas" valor={`R$ ${despesas.toFixed(2)}`} corFundo="B71C1C" />
            </View>

            <Text style={styles.tituloExtrato}>Extrato Financeiro</Text>

            {carregando ? (
                <ActivityIndicator size="large" color="#BB72FF" />
            ) : (
                <FlatList
                    data={transacoes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemCard}>
                            <View>
                                <Text style={styles.descricao}>{item.descricao}</Text>
                                <Text style={styles.categoria}>{item.categoria} - {item.data}</Text>
                            </View>
                            <Text style={item.tipo === 'receita' ? styles.valorReceita : styles.valorDespesa}>
                                {item.tipo === 'receita' ? '+' : '-'} R$ {(
                                    typeof item.valor === 'number' ? item.valor : Number(item.valor || 0)
                                ).toFixed(2)}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#021123', padding: 20, paddingTop: 50 },
    cardSaldo: { backgroundColor: '#144800', padding: 20, borderRadius: 12, marginBottom: 15 },
    labelSaldo: { color: '#fff', fontSize: 16 },
    valorSaldo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
    tituloExtrato: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    itemCard: { backgroundColor: '#0B2545', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    descricao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    categoria: { color: '#A0A0A0', fontSize: 16, marginTop: 4 },
    valorReceita: { color: '#2ECC71', fontSize: 16, fontWeight: 'bold' },
    valorDespesa: { color: '#E74C3C', fontSize: 16, fontWeight: 'bold' },
});