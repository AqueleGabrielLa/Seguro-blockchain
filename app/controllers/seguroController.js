//cadastrarSegurado, criarApolice, pagarPremio consultarSegurado saldoContrato registrarSinistro

// processarEPagarSinistro 
// consultarApoliceBase consultarApoliceStatus 
// apoliceEstaPaga retirarFundos
const contract = require('../server');

const helper = {
    async error(error){
        console.error('Erro ao cadastrar segurado:', error);
            res.status(500).json({
            error: 'Erro ao cadastrar segurado',
            details: error.message
        });
    }
}

const seguroController = {

    async cadastrarSegurado (req, res) {
        try {
            const { endereco, nome, documento } = req.body;
            if(!endereco || !nome || !documento){
                return res.status(400).json({ 
                    error: 'Dados incompletos. Forneça endereço, nome e documento.' 
                });
            }

            const tx = await contract.cadastrarSegurado(endereco, nome, documento);
            const receipt = await tx.wait();

            res.json({
                success: true,
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber
            });
        } catch (error) {
            helper.error(error);
        }
    },

    // Criar nova apólice
    async criarApolice(req, res) {
        try {
            const { endereco, tipo, valorPremio, valorCobertura, prazo } = req.body;
            
            if(!endereco || !tipo || !valorCobertura || !valorPremio || !prazo){
                return res.status(400).json({ 
                    error: 'Dados incompletos. Forneça endereço, nome e documento.' 
                });
            }

            const tx = await contract.criarApolice(
                endereco,
                tipo,
                parseEther(valorPremio.toString()),
                parseEther(valorCobertura.toString()),
                prazo
            );
            const receipt = await tx.wait();

            res.json({
                success: true,
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber
            });
        } catch (error) {
            helper.error(error);
        }
    },

    // Realizar pagamento de prêmio
    async pagarPremio(req, res) {
        try {
            const { idApolice } = req.params;
            const { valor } = req.body;

            const tx = await contract.pagarPremio(idApolice, {
                value: parseEther(valor.toString())
            });
            const receipt = await tx.wait();

            res.json({
                success: true,
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber
            });
        } catch (error) {
            helper.error(error);
        }
    },

    async registrarSinistro(req, res) {
        try {
            const { idApolice } = req.params;
            const {descricao, valor} = req.body;

            const tx = await contract.registrarSinistro(idApolice, descricao, valor);
            const receipt = await tx.wait();

            res.json({
                success: true,
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber
            });
        } catch (error) {
            helper.error(error);
        }
    },

    async consultarSegurado(req, res) {
        try {
            const { endereco } = req.params;
            const segurado = await contract.consultarSegurado(endereco);
            
            res.json({
                nome: segurado.nome,
                documento: segurado.documento,
                ativo: segurado.ativo
            });
        } catch (error) {
            helper.error(error);
        }
    },

    async saldoContrato (req, res) {
        try {
            const saldo = await contract.saldoContrato();
            res.json({success: true, data: saldo});
        } catch (error) {
            res.status(300).json({ success: false, error: error.message });
        }
    }
}

module.exports = seguroController;