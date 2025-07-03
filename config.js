// 合约配置文件
const CONFIG = {
    // 合约地址
    contractAddress: "0x8153eb5c804783fffef2846beb50c2b5f28eda3b",
    
    // 网络配置
    network: "sepolia",
    chainId: 84532,
    
    // 当前链详细配置
    CHAIN_CONFIG: {
        chainId: '0x14a34',
        chainName: 'Base Sepolia',
        nativeCurrency: {
            name: 'Base Sepolia ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://sepolia.base.org'],
        blockExplorerUrls: ['https://sepolia.basescan.org']
    },
    
    // 链ID映射配置
    CHAIN_NAMES: {
        '0x14a34': 'Base Sepolia',
        '84532': 'Base Sepolia'
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
