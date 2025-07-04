import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// 合约地址和 ABI（可后续拆分到 utils/contractABI.js）
const contractAddress = "0x0a1d2dee15cc7548a433203992417037afe91c99"; // Sepolia
const contractABI = [
  // Functions for minting and sale toggle
  "function mint(uint256 count) public payable",
  "function saleIsActive() public view returns (bool)",
  "function setSaleIsActive(bool saleIsActive_) external",
  "function owner() public view returns (address)",
  "function PRICE() public view returns (uint256)",
  "function MAX_SUPPLY() public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  // Functions for NFT viewing/revealing
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function reveal(uint256 tokenId) public",
  "function burn(uint256 tokenId) public",
  "function burnBatch(uint256[] tokenIds) external",
  "function defaultBaseURI() public view returns (string)",
  // Event for finding tokens
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  // New functions for owner
  "function setBaseURI(string calldata defaultBaseURI_) external",
  "function setIpfsBaseURI(string calldata ipfsBaseURI_) external",
  "function setSpecialURI(string calldata specialURI_) external",
  "function ownerMintSpecial(uint256 count, address to) external",
  "function revealBatch(uint256[] tokenIds) external",
  "function specialBurn(uint256 tokenId) external",
  "function setBatchBurnThreshold(uint256 newThreshold) external"
];

function App() {
  const [userAccount, setUserAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [status, setStatus] = useState('');
  const [nfts, setNfts] = useState([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);

  // 钱包连接
  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('请先安装 MetaMask 钱包插件');
      return;
    }
    try {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = _provider.getSigner();
      const _userAccount = await _signer.getAddress();
      const _contract = new ethers.Contract(contractAddress, contractABI, _signer);
      setProvider(_provider);
      setSigner(_signer);
      setUserAccount(_userAccount);
      setContract(_contract);
      // 检查 owner
      const ownerAddr = await _contract.owner();
      setIsOwner(_userAccount.toLowerCase() === ownerAddr.toLowerCase());
      setStatus('钱包连接成功');
    } catch (err) {
      setStatus('钱包连接失败: ' + (err && err.message ? err.message : '未知错误'));
    }
  };

  // 加载当前用户NFT列表
  const loadMyNFTs = async () => {
    if (!contract || !userAccount) return;
    setLoadingNFTs(true);
    setNfts([]);
    try {
      const balance = await contract.balanceOf(userAccount);
      if (balance.eq(0)) {
        setNfts([]);
        setLoadingNFTs(false);
        return;
      }
      // 通过 Transfer 事件找到所有曾经转给你的tokenId
      const transferFilter = contract.filters.Transfer(null, userAccount);
      const events = await contract.queryFilter(transferFilter, 0, 'latest');
      const potentialTokenIds = [...new Set(events.map(event => event.args.tokenId.toString()))];
      let ownedNFTs = [];
      for (const tokenId of potentialTokenIds.reverse()) {
        try {
          const currentOwner = await contract.ownerOf(tokenId);
          if (currentOwner.toLowerCase() !== userAccount.toLowerCase()) continue;
          let tokenURI = '';
          let type = 'revealed';
          let metadata = null;
          try {
            tokenURI = await contract.tokenURI(tokenId);
            if (tokenURI && tokenURI.includes('unrevealed.json')) {
              type = 'unreveal';
            } else if (tokenURI && tokenURI.includes('special.json')) {
              type = 'special';
            } else if (parseInt(tokenId) >= 20000) {
              type = 'reward';
            }
            // 只加载 revealed/special/reward 的 metadata
            if (type !== 'unreveal' && tokenURI) {
              const metadataUrl = tokenURI.startsWith('ipfs://')
                ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
                : tokenURI;
              try {
                const response = await fetch(metadataUrl);
                if (response.ok) {
                  metadata = await response.json();
                }
              } catch (e) {
                // 忽略 metadata 加载失败
              }
            }
          } catch (e) {
            // 忽略 tokenURI 获取失败
          }
          ownedNFTs.push({ tokenId, tokenURI, type, metadata });
        } catch (e) {
          // ownerOf 失败，可能已burn，跳过
        }
      }
      setNfts(ownedNFTs);
    } catch (err) {
      setStatus('NFT加载失败: ' + (err && err.message ? err.message : '未知错误'));
    }
    setLoadingNFTs(false);
  };

  // 钱包连接后自动加载NFT
  useEffect(() => {
    if (contract && userAccount) {
      loadMyNFTs();
    }
    // eslint-disable-next-line
  }, [contract, userAccount]);

  return (
    <div className="App">
      <h1>Toy3BoXXX NFT DApp (React重构)</h1>
      <div style={{ marginBottom: 16 }}>
        {userAccount ? (
          <span>已连接: {userAccount}</span>
        ) : (
          <button onClick={connectWallet}>连接钱包</button>
        )}
        {isOwner && <span style={{ marginLeft: 12, color: '#e53935' }}>[合约Owner]</span>}
      </div>
      <div style={{ color: '#888', marginBottom: 16 }}>{status}</div>
      <div style={{ margin: '24px 0' }}>
        <h2>我的NFT</h2>
        <button onClick={loadMyNFTs} disabled={loadingNFTs} style={{ marginBottom: 12 }}>
          {loadingNFTs ? '加载中...' : '刷新NFT列表'}
        </button>
        {loadingNFTs ? (
          <div>正在加载...</div>
        ) : nfts.length === 0 ? (
          <div>你没有NFT。</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {nfts.map(nft => (
              <div key={nft.tokenId} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, width: 180 }}>
                <div style={{ fontWeight: 'bold' }}>Token ID: {nft.tokenId}</div>
                {nft.metadata && nft.metadata.image ? (
                  <img src={nft.metadata.image.startsWith('ipfs://') ? nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : nft.metadata.image} alt={nft.tokenId} style={{ width: '100%', height: 120, objectFit: 'cover', margin: '8px 0' }} />
                ) : (
                  <div style={{ color: '#999', fontSize: 12, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>无图片</div>
                )}
                <div style={{ fontSize: 13, color: '#555' }}>
                  <b>类型:</b> {nft.type}
                </div>
                <div style={{ fontSize: 13 }}><b>Name:</b> {nft.metadata?.name || '无'}</div>
                <div style={{ fontSize: 12, color: '#555' }}><b>Description:</b> {nft.metadata?.description || '无'}</div>
                {nft.metadata?.attributes && Array.isArray(nft.metadata.attributes) && nft.metadata.attributes.length > 0 ? (
                  <div style={{ fontSize: 12 }}>
                    <b>Attributes:</b> {nft.metadata.attributes.map((attr, i) => (
                      <span key={i} style={{ marginRight: 8 }}>{attr.trait_type}: {attr.value}</span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12 }}><b>Attributes:</b> 无</div>
                )}
                {/* 后续操作按钮插入点 */}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 后续功能区块将插入于此 */}
    </div>
  );
}

export default App;
