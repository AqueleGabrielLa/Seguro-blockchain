//cadastrarSegurado, criarApolice, pagarPremio consultarSegurado saldoContrato registrarSinistro

// processarEPagarSinistro 
// consultarApoliceBase consultarApoliceStatus 
// apoliceEstaPaga retirarFundos
const contract = require('../server.js');
const { ethers } = require('ethers');
const { JsonRpcProvider } = require('ethers');

const helper = {
    async error(error){
        console.error('Erro ao cadastrar segurado:', error);
            res.status(500).json({
            error: 'Erro ao cadastrar segurado',
            details: error.message
        });
    }
}

module.exports = {
    async cadastrarSegurado(req, res) {
        console.log("Recebendo requisição JSON-RPC...");
    
        const { jsonrpc, method, params, id } = req.body;
    
        // Validar se o formato JSON-RPC está correto
        if (jsonrpc !== '2.0' || method !== 'cadastrarSegurado' || !Array.isArray(params)) {
            return res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Invalid Request',
                },
                id: id || null,
            });
        }
    
        try {
            const [endereco, nome, documento] = params;
            if (!endereco || !nome || !documento) {
                return res.status(400).json({
                    jsonrpc: '2.0',
                    error: {
                        code: -32602,
                        message: 'Dados incompletos. Forneça endereço, nome e documento.',
                    },
                    id,
                });
            }

            const provider = new JsonRpcProvider(process.env.RPC_URL);
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

            const contractWithSigner = contract.connect(wallet);

            // Chamada ao contrato inteligente
            const tx = await contractWithSigner.cadastrarSegurado(endereco, nome, documento);
            const receipt = await tx.wait();
    
            return res.json({
                jsonrpc: '2.0',
                result: {
                    success: true,
                    transactionHash: tx.hash,
                    blockNumber: receipt.blockNumber,
                },
                id,
            });
        } catch (error) {
            console.error("Erro no método cadastrarSegurado:", error);
            return res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Erro interno do servidor.',
                    data: error.message,
                },
                id,
            });
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