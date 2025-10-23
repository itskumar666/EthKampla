# 🚀 Quick Start Guide - MicroSave AI

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18+ installed
- [ ] MetaMask browser extension installed
- [ ] OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- [ ] WalletConnect Project ID ([get one here](https://cloud.walletconnect.com))
- [ ] Base Sepolia testnet ETH ([faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))

## Setup Steps

### 1. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_CONTRACT_ADDRESS=
PRIVATE_KEY=your-wallet-private-key-without-0x
```

**Important:**
- Get OpenAI API key: https://platform.openai.com/api-keys
- Get WalletConnect ID: https://cloud.walletconnect.com (create free account)
- Export private key from MetaMask (Settings → Security & Privacy → Show private key)
- **NEVER commit `.env.local` to git!**

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Compile Smart Contract

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### 4. Deploy to Base Sepolia

Make sure you have Base Sepolia ETH in your wallet, then:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

Expected output:
```
Deploying SavingsPool contract to Base Sepolia...
✅ SavingsPool deployed to: 0x123...abc

📝 Add this to your .env.local file:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x123...abc
```

**Copy the contract address** and add it to your `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x123...abc
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 🎉

## Testing the App

### Connect Wallet
1. Click "Connect Wallet" button
2. Select MetaMask
3. Approve connection
4. Switch to Base Sepolia network if prompted

### Create a Savings Pool
1. Click "Create New Pool"
2. Fill in details:
   - **Name**: "Test Emergency Fund"
   - **Target**: 0.01 (ETH)
   - **Contribution**: 0.001 (ETH)
   - **Duration**: 30 (days)
3. Click "Create Pool"
4. Confirm transaction in MetaMask
5. Wait for confirmation (~2 seconds)

### Contribute to Pool
1. Find your created pool in the list
2. Click "Contribute 0.001 ETH"
3. Confirm transaction in MetaMask
4. See your contribution appear!

### Test AI Chatbot
1. Click the chatbot icon (bottom right)
2. Ask questions like:
   - "How do savings pools work?"
   - "What's the best way to save money?"
   - "Explain blockchain to me"
3. Get instant AI-powered answers!

## Troubleshooting

### Build Errors
If you see TypeScript errors, they're ignored in build. The app will still work.

### "Contract not deployed" Error
Make sure you:
1. Deployed the contract (`npx hardhat run scripts/deploy.js --network baseSepolia`)
2. Added `NEXT_PUBLIC_CONTRACT_ADDRESS` to `.env.local`
3. Restarted the dev server

### Wallet Connection Issues
1. Make sure you're on Base Sepolia network
2. Clear browser cache
3. Try disconnecting and reconnecting wallet

### AI Chatbot Not Working
1. Check `NEXT_PUBLIC_OPENAI_API_KEY` is set correctly
2. Verify you have API credits remaining
3. Check browser console for errors

## Next Steps

### For Demo/Presentation

1. **Record Demo Video**:
   - Show connecting wallet
   - Create a pool
   - Make a contribution
   - Use AI chatbot
   - Show pool progress

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   
   # Add environment variables in Vercel dashboard
   ```

3. **Prepare Hackathon Submission**:
   - ✅ GitHub repo (make sure it's public)
   - ✅ README with project description
   - ✅ Demo video (under 5 minutes)
   - ✅ Live demo URL
   - ✅ Contract address on Base Sepolia

### For Further Development

- Add email/SMS notifications
- Implement rotating withdrawal system
- Add more AI features (savings predictions, budget analysis)
- Support multiple currencies (USDC, etc.)
- Add governance features for pool members

## Support

If you encounter issues:
1. Check the main README.md for detailed documentation
2. Review error messages carefully
3. Check Base Sepolia block explorer for transaction status
4. Ensure all environment variables are set correctly

## Hackathon Submission Checklist

- [ ] Project builds successfully
- [ ] Smart contract deployed on Base Sepolia
- [ ] Frontend works on localhost
- [ ] AI chatbot responds correctly
- [ ] Deployed to Vercel/production
- [ ] Demo video recorded (< 5 min)
- [ ] README updated with live links
- [ ] GitHub repo is public
- [ ] All features documented

---

**Ready to win EthNile'25! 🏆**
