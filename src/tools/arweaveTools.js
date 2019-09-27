import Arweave from 'arweave/web'
import uuidv4 from 'uuid/v4'
import crypto from 'crypto'

const secret = uuidv4()

const arweaveInstance = Arweave.init({
    host: 'arweave.net',
    port: 80,           
    protocol: 'https',
    timeout: 90000,
    logging: false,
})

function readArweaveWallet(wallet){
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => {
        reader.abort()
        reject()
        }
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsText(wallet)
    })
}


const generateNewFolderArweaveTx = async(folderName, folderDescription, arweaveWallet, arweaveAddress) => new Promise(async (resolve, reject) => {
    try{
        const hash = await crypto.createHmac('sha256', secret)
        .update(folderName + uuidv4() + arweaveAddress )
        .digest('hex')
        console.log(hash)
        const data = JSON.stringify({
            folderName, folderDescription, id: hash
        })
        let transaction = await arweaveInstance.createTransaction({ data }, arweaveWallet)
        await transaction.addTag('folderId', hash)
        await transaction.addTag('name', folderName)
        await transaction.addTag('ArdApp', 'akashic-storage-folder')
        const fee = await arweaveInstance.ar.winstonToAr(transaction.reward)
        resolve({ transaction, fee })
    }catch(error){
        console.log(error)
        reject(error)
    }
})

const generateNewFileArweaveTx = async(fileData, fileName, fileDescription, folderId, arweaveWallet) => new Promise(async (resolve, reject) => {
    try{
        const hash = await crypto.createHmac('sha256', fileData)
        .update(fileName + uuidv4() + folderId )
        .digest('hex')
        console.log(hash)
        const data = JSON.stringify({
            fileName, fileDescription, fileData, fileId: hash
        })
        let transaction = await arweaveInstance.createTransaction({ data }, arweaveWallet)
        await transaction.addTag('fileId', hash)
        await transaction.addTag('folderId', folderId)
        await transaction.addTag('ArdApp', 'akashic-storage-file')
        const fee = await arweaveInstance.ar.winstonToAr(transaction.reward)
        resolve({ transaction, fee })
    }catch(error){
        console.log(error)
        reject(error)
    }
})

const getUserFolders = async (arweaveAddress) => new Promise(async (resolve, reject) => {
    try{
        const query = {
          op: 'and',
          expr1: {
              op: 'equals',
              expr1: 'from',
              expr2: arweaveAddress
          },
          expr2: {
              op: 'equals',
              expr1: 'ArdApp',
              expr2: 'akashic-storage-folder'
          }     
        }
        const transactionList = await arweaveInstance.arql(query)
        if(transactionList.length === 0){
          console.log('No Folders')
          resolve([])
        }else{
          let result = []
          transactionList.map((tx) => result.push(getTransationData(tx)))
          const resultData = await Promise.all(result)
          console.log(resultData)
          resolve(resultData)
        }
      }catch(error){
        console.log(error)
        reject(error)
      }  
})

const getFolders = async () => new Promise(async (resolve, reject) => {
    try{
        const query = {
              op: 'equals',
              expr1: 'ArdApp',
              expr2: 'akashic-storage-folder'    
        }
        const transactionList = await arweaveInstance.arql(query)
        if(transactionList.length === 0){
          console.log('No Folders')
          resolve([])
        }else{
          let result = []
          transactionList.map((tx) => result.push(getTransationData(tx)))
          const resultData = await Promise.all(result)
          console.log(resultData)
          resolve(resultData)
        }
      }catch(error){
        console.log(error)
        reject(error)
      }  
})

const getFilesFolder = async (folderId) => new Promise(async (resolve, reject) => {
    try{
        const query = {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'folderId',
                expr2: folderId
            },
            expr2: {
                op: 'equals',
                expr1: 'ArdApp',
                expr2: 'akashic-storage-file'
            }     
          }
          const transactionList = await arweaveInstance.arql(query)
          if(transactionList.length === 0){
            console.log('No Folders')
            resolve([])
          }else{
            let result = []
            transactionList.map((tx) => result.push(getTransationData(tx)))
            const resultData = await Promise.all(result)
            console.log(resultData)
            resolve(resultData)
          }
    }catch(error){
        console.log(error)
        reject(error)
    }
})

const getTransationData = async (txId) => {
    try{
        const transaction = await arweaveInstance.transactions.get(txId)
        const dataString = await transaction.get('data', { decode: true, string: true })
        let result = JSON.parse(dataString)
        result.txId = txId
        return result
    }catch(error){
        console.log(error)
        return null
    }
}

const generateTipArweaveTx = async(fileId, ownerFileArweaveAddress, valueTip, arweaveWallet) => new Promise(async (resolve, reject) => {
    try{
        let transaction = await arweaveInstance.createTransaction({ 
            target: ownerFileArweaveAddress,
            quantity: arweaveInstance.ar.arToWinston(valueTip)
        }, arweaveWallet)
        await transaction.addTag('tip-colab', fileId)
        const fee = await arweaveInstance.ar.winstonToAr(transaction.reward)
        resolve({ transaction, fee })
    }catch(error){
        console.log(error)
        reject(error)
    }
})

const getFileTips = async (fileId) => new Promise(async (resolve, reject) => {
    try{
        const query = {
              op: 'equals',
              expr1: 'tip-colab',
              expr2: fileId    
        }
        const transactionList = await arweaveInstance.arql(query)
        if(transactionList.length === 0){
          console.log('No Tips')
          resolve([])
        }else{
          let result = []
          transactionList.map((tx) => result.push(getTransationValue(tx)))
          const resultData = await Promise.all(result)
          console.log(resultData)
          resolve(resultData)
        }
      }catch(error){
        console.log(error)
        reject(error)
      }  
})

const getTransactionOwner = async (transacionId) => new Promise(async (resolve, reject) => {
    try{
        const tx = await arweaveInstance.transactions.get(transacionId)
        const address = await arweaveInstance.wallets.ownerToAddress(tx.owner)
        resolve(address)
    }catch(error){
        console.log(error)
        reject()
    }
})

const getTransationValue = async (txId) => {
    try{
        const transaction = await arweaveInstance.transactions.get(txId)
        const qnt = await arweaveInstance.ar.winstonToAr(transaction.quantity)
        const result = {
            txId, valueTip: qnt
        }
        return result
    }catch(error){
        console.log(error)
        return null
    }
}




export{
    arweaveInstance,
    readArweaveWallet,
    generateNewFolderArweaveTx,
    getUserFolders,
    getFolders,
    generateNewFileArweaveTx,
    getFilesFolder,
    generateTipArweaveTx,
    getTransactionOwner,
    getFileTips
}