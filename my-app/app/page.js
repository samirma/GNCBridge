'use client'

export default function Page() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [mood, setMood] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        setAccount(accounts[0]);
      });
    }
  }, []);

  async function connectWallet() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            31337: 'http://127.0.0.1:8545/'
          }
        },
      },
    };
  
    const web3Modal = new Web3Modal({
      network: 'LocalGnc',
      cacheProvider: true,
      providerOptions,
    });

    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const yourContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    setAccount(await signer.getAddress());
    setContract(yourContract);
  }

  async function updateMood() {
    await contract.setMood(mood);
  }

  async function fetchMood() {
    const mood = await contract.getMood();
    alert(`Mood is: ${mood}`);
  }

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/contract">Contract</Link></li>
        </ul>
      </nav>

      <button onClick={connectWallet}>Connect Wallet</button>
      {account && contract && (
        <>
          <input type="text" value={mood} onChange={e => setMood(e.target.value)} />
          <button onClick={updateMood}>Update Mood</button>
          <button onClick={fetchMood}>Fetch Mood</button>
        </>
      )}
    </div>
  );
}
