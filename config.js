// 合约配置文件
const CONFIG = {
    // 合约地址
    contractAddress: "0x0a1d2dee15cc7548a433203992417037afe91c99",
    
    // 网络配置
    network: "sepolia",
    chainId: 11155111,
    
    // 当前链详细配置
    CHAIN_CONFIG: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: {
            name: 'SepoliaETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://rpc.sepolia.org'],
        blockExplorerUrls: ['https://sepolia.etherscan.io/']
    },
    
    // 链ID映射配置
    CHAIN_NAMES: {
        '0x1': 'Ethereum',
        '0x38': 'BNB Chain',
        '0x89': 'Polygon',
        '0xaa36a7': 'Sepolia'
    },
    
    // RPC配置（可选）
    // rpcUrl: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    
    // 区块浏览器
    explorerUrl: "https://sepolia.etherscan.io",
    
    // 其他配置项
    maxMintPerTx: 10,
    mintPrice: "0.0025",
    maxSupply: 888
};

// 导出配置（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 