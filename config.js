// 合约配置文件
const CONFIG = {
    // 合约地址
    contractAddress: "0xEe58e20D538a98E9DF2B62400f9A4D00E737B1a0 ",
   
   //0x2505F5729D149FdEEbaf4c301c6327b585DbEcCb
    
    // 网络配置
    network: "sepolia",
    chainId: 11155111,
    
    // 当前链详细配置
    CHAIN_CONFIG: {
        chainId: '84532',
        chainName: 'Base Sepolia',
        nativeCurrency: {
            name: 'Base Sepolia',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://sepolia.base.org'],
        blockExplorerUrls: ['https://sepolia-explorer.base.org']
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
