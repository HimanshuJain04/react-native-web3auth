import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import '@ethersproject/shims';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Web3Auth, {
  ChainNamespace,
  LOGIN_PROVIDER,
  WEB3AUTH_NETWORK,
} from '@web3auth/react-native-sdk';
import {SolanaPrivateKeyProvider} from '@web3auth/solana-provider';
import EncryptedStorage from 'react-native-encrypted-storage';

const scheme = 'web3auth';
const redirectUrl = `${scheme}://openlogin`;

const clientId = 'client-id';

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: {
    chainConfig: {
      chainNamespace: ChainNamespace.SOLANA,
      chainId: '0x1',
      rpcTarget: 'https://rpc.ankr.com/solana',
      displayName: 'Solana Devnet',
      blockExplorerUrl: 'https://explorer.solana.com/',
      ticker: 'SOL',
      tickerName: 'Solana',
    },
  },
});

const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId,
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  redirectUrl,
  privateKeyProvider,
});

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      console.log('Init--web3--');
      await web3auth.init();
      console.log('ready: ', web3auth.ready);
      console.log('connected: ', web3auth.connected);
      if (web3auth.connected) {
        setLoggedIn(true);
      }
    };
    init();
  }, []);

  const login = async () => {
    try {
      console.log(web3auth.ready);

      if (!web3auth.ready) {
        console.log('Web3auth not initialized');
        return;
      }

      console.log(`Email: ${email}`);

      if (!email) {
        console.log('Enter email first');
        return;
      }

      console.log('Logging in');
      // IMP START - Login
      await web3auth.login({
        loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS,
        extraLoginOptions: {
          login_hint: email,
        },
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <View>
        <TextInput placeholder="Enter email" onChangeText={setEmail} />
        <Button title="Login with Web3Auth" onPress={login} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
    flex: 1,
  },
});
