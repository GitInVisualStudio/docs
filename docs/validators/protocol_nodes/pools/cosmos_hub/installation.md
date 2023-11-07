---
sidebar_position: 3
---

# Installation

This section will deal with the installation for the Gaia Full Node and the KYVE protocol validator. The Gaia Full
Node will act as the source for the KYVE protocol validator and is **required**. You can either run the Gaia node on
a seperate machine or run it on the same machine with the KYVE protocol together.

:::danger
Due to very specific requirements, an additional validation layer, accessibility as well as to prevent slashes, it is strongly recommended to run an independent data source node. API providers should be avoided and have already led to critical problems in the past.
:::

## Install Gaia full node

The gaia binary with the version `v4.2.1` has to be installed. You can follow the official installation instructions [here](https://hub.cosmos.network/main/getting-started/installation.html) or download the binary directly from [here](https://github.com/cosmos/gaia/releases/tag/v4.2.1).

:::danger
If you are building from source please use the specified go version in the go.mod file, else there is the danger of receiving vote slashes.

**For gaiad v4.2.1 it is go15**
:::

You can verify the successful installation with

```
./gaiad version
4.2.1
```

In order to setup the gaia config first choose a moniker and init gaia:

```bash
./gaiad init <your-moniker> --chain-id cosmoshub-4
```

To install the genesis file execute the following command:

```bash
wget https://raw.githubusercontent.com/cosmos/mainnet/master/genesis/genesis.cosmoshub-4.json.gz
gzip -d genesis.cosmoshub-4.json.gz
mv genesis.cosmoshub-4.json ~/.gaia/config/genesis.json
```

Peers can be added via this addrbook which can be retrieved here:

```bash
wget https://dl2.quicksync.io/json/addrbook.cosmos.json
mv addrbook.cosmos.json ~/.gaia/config/addrbook.json
chmod 666 ~/.gaia/config/addrbook.json
```

**TIP**: You can also add persistent_peers from Polkachu to ensure that you will actually find peers where you can sync with the network: https://polkachu.com/live_peers/cosmos

### Configuration

Due to the size of the `block_results` response, it is **required** to set the following in your `~/.gaia/config/config.toml`:

```toml
timeout_broadcast_tx_commit = "120s"
```

For pruning the following settings are recommended to decrease the disk usage:

`~/.gaia/config/config.toml`

```toml
[tx_index]

indexer = "null"
```

`~/.gaia/config/app.toml`

```toml
pruning = "everything"

index-events = [""]
```

Finally, the node can be started:

**NOTE**: For some users it might be required to increase the limit of open files on your system with `ulimit -n 65536`

**INFO**: Since the genesis file is quite big (over 100MB) the starting process can take a serveral minutes before the node starts to sync blocks.

```bash
./gaiad start --x-crisis-skip-assert-invariants
```

Now you have to sync blocks until the latest summary of the pool is reached. For example
if the latest pool summary is 6,000,000 you can check if the node has synced the blocks until
that height with:

```bash
curl http://localhost:26657/block?height=6000000
```

If it returns a valid block response you can continue with starting the actual KYVE protocol validator
and start participating in the validation and archival process.

**TIP**: to save storage space you can start pruning blocks manually after they have been archived
by the pool since after that they are not needed anymore.

**TIP**: to make it easier during chain upgrades we also recommend running the chain with _cosmosvisor_. You can find official instructions [here](https://hub.cosmos.network/main/hub-tutorials/upgrade-node.html#cosmovisor)

## Install KYVE protocol validator

### Install KYSOR

Get the latest release of the KYSOR binaries [here](https://github.com/KYVENetwork/kyvejs/releases?q=kysor&expanded=true)

Once you have the latest version for you operating system simply
pull them down:

```bash
wget https://github.com/KYVENetwork/kyvejs/releases/download/%40kyve%2Fkysor%401.0.0-beta.20/kysor-linux-x64.zip
unzip kysor-linux-x64.zip
mv kysor-linux-x64 kysor
chmod 700 kysor
```

To verify that the KYSOR runs successfully just run

```bash
./kysor version
```

### Initialize KYSOR

After the successful installation of KYSOR it now needs to be initialized. Depending on the network you want to join a different
configuration needs to be passed to the init options.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="network">
  <TabItem value="kyve" label="Mainnet">

Official Mainnet endpoints:

```bash
EU RPC: 'https://rpc-eu-1.kyve.network'
EU API: 'https://api-eu-1.kyve.network'

US RPC: 'https://rpc-us-1.kyve.network'
US API: 'https://api-us-1.kyve.network'
```

Depending on your geolocation certain endpoints can be used as a primary and secondary endpoints.
Primary endpoints are used by default, secondary ones only when the primary fails and so on. It is also possible
to only use one or more than two. It is important that the number of endpoints used for rpc and api are equal.

```bash
./kysor init \
--chain-id 'kyve-1' \
--rpc '<primary_rpc>,<secondary_rpc>,...' \
--rest '<primary_api>,<secondary_api>,...'
```

  </TabItem>
  <TabItem value="kaon" label="Kaon">

Official Kaon endpoints:

```bash
EU RPC: 'https://rpc-eu-1.kaon.kyve.network'
EU API: 'https://api-eu-1.kaon.kyve.network'

US RPC: 'https://rpc-us-1.kaon.kyve.network'
US API: 'https://api-us-1.kaon.kyve.network'
```

Depending on your geolocation certain endpoints can be used as a primary and secondary endpoints.
Primary endpoints are used by default, secondary ones only when the primary fails and so on. It is also possible
to only use one or more than two. It is important that the number of endpoints used for rpc and api are equal.

```bash
./kysor init \
--chain-id 'kaon-1' \
--rpc '<primary_rpc>,<secondary_rpc>,...' \
--rest '<primary_api>,<secondary_api>,...'
```

  </TabItem>
  <TabItem value="korellia" label="Korellia">

```bash
./kysor init \
--chain-id 'korellia' \
--rpc 'https://rpc-eu-1.korellia.kyve.network' \
--rest 'https://api-eu-1.korellia.kyve.network' \
--auto-download-binaries
```

  </TabItem>
</Tabs>

Once you have initialized KYSOR you can verify the successful initialization by printing out the home directory:

```bash
ls ~/.kysor
```

There should be a `config.toml` file where the configurations you just defined are saved. You can change those at any time if you want.

### Create the Valaccount

Now that KYSOR is initialized we move on to the next step. For every pool you run on a _valaccount_ has to be created. A new valaccount with a new mnemonic can be created in the following way:

<Tabs groupId="network">
  <TabItem value="kyve" label="Mainnet">

```bash
./kysor valaccounts create \
--name 'cosmoshub' \
--pool 0 \
--storage-priv "$(cat path/to/arweave.json)" \
--metrics
```

This will create a `cosmoshub.toml` file under the KYSOR home directory in `~/.kysor/valaccounts/` where all the other valaccounts are stored. There you can view your valaccount config.

If you want to create a valaccount from an existing mnemonic just add the `--recover` flag like this:

```bash
./kysor valaccounts create \
--name cosmoshub \
--pool 0 \
--storage-priv "$(cat path/to/arweave.json)" \
--metrics \
--recover
```

This will prompt you to enter the mnemonic you want to import. More help on how to manage valaccounts can be found with `./kysor valaccounts --help`

  </TabItem>
  <TabItem value="kaon" label="Kaon">

```bash
./kysor valaccounts create \
--name 'cosmoshub' \
--pool 0 \
--storage-priv "$(cat path/to/arweave.json)" \
--metrics
```

This will create a `cosmoshub.toml` file under the KYSOR home directory in `~/.kysor/valaccounts/` where all the other valaccounts are stored. There you can view your valaccount config.

If you want to create a valaccount from an existing mnemonic just add the `--recover` flag like this:

```bash
./kysor valaccounts create \
--name cosmoshub \
--pool 0 \
--storage-priv "$(cat path/to/arweave.json)" \
--metrics \
--recover
```

This will prompt you to enter the mnemonic you want to import. More help on how to manage valaccounts can be found with `./kysor valaccounts --help`

  </TabItem>
  <TabItem value="korellia" label="Korellia">

```bash
./kysor valaccounts create \
--name 'cosmoshub' \
--pool 24 \
--storage-priv "$(cat path/to/arweave.json)" \
--metrics
```

This will create a `cosmoshub.toml` file under the KYSOR home directory in `~/.kysor/valaccounts/` where all the other valaccounts are stored. There you can view your valaccount config.

If you want to create a valaccount from an existing mnemonic just add the `--recover` flag like this:

```bash
./kysor valaccounts create \
--name cosmoshub \
--pool 24 \
--storage-priv "$(cat path/to/arweave.json)" \
--metrics \
--recover
```

This will prompt you to enter the mnemonic you want to import. More help on how to manage valaccounts can be found with `./kysor valaccounts --help`

  </TabItem>
</Tabs>

:::danger
**ATTENTION**: Since the valaccount config files store the valaccount's mnemonic and the wallet keyfile for the storage provider you should **never** share this file with anyone.
:::

Loosing the mnemonic of the valaccount can cause a timeout slash. If a third party ever gets hold of the mnemonic an upload slash can be the worst case since they have control over the vote and upload behaviour of the node. Loosing the private keyfile of the storage provider means loosing your funds.

### Install Pool Binaries

In the last step of the installation process of KYSOR the actual pool runtime
binaries need to be installed in KYSOR.

#### General KYSOR Directory Structure

Knowing where KYSOR saves it's logs and binaries can be helpful. The example below shows the following setup: The KYSOR runs on two pools with pool id `0` and `2`. Pool `2` is still running on version `0.8.6` while pool `0` has already upgraded from `1.8.6` to `1.8.7`

```
.kysor
├── config.toml
├── logs
│   └── 2022-09-29T08:38:24.513Z.log
│   └── 2022-09-29T09:29:22.219Z.log
├── upgrades
│   ├── pool-0
│   |   ├── 1.8.6
│   |   |   ├── bin
│   |   |   │   └── kyve-linux-x64
│   |   |   ├── cache
|   |   |   │   ├── 234.json
|   |   |   │   └── ...
│   |   |   └── logs
│   |   |       ├── 2022-09-29T08:23:02.003Z.log
│   |   |       └── 2022-09-29T08:23:24.953Z.log
│   |   └── 1.8.7
│   |       ├── bin
│   |       │   └── kyve-linux-x64
│   |       ├── cache
|   |       │   ├── 567.json
|   |       │   └── ...
│   |       └── logs
│   |           └── 2022-09-29T08:23:24.953Z.log
│   └── pool-2
│       └── 0.8.6
│           ├── bin
│           │   └── kyve-linux-x64
│           ├── cache
|           │   ├── 3847.json
|           │   └── ...
│           └── logs
│               └── 2022-09-29T08:23:02.003Z.log
└── valaccounts
    ├── cosmoshub.toml
    └── osmosis.toml
```

Here the following directories have the following reason:

- `.kysor` - KYSOR home directory, created with init command
- `config.toml` - general KYSOR config, created with init command
- `logs` - logs folder containing KYSOR log files. Each log file is a run from start to end where the date is the starting date
- `upgrades` - most important directory, contains all the binaries for every pool
- `upgrades/pool-$id` - holds every binary of every installed version of the specified pool
- `upgrades/pool-$id/$version` - acts as a home directory for a specific binary, contains binary cache, logs and actual protocol validator binary
- `upgrades/pool-$id/$version/bin` - holds actual node binary
- `upgrades/pool-$id/$version/cache` - contains cached data relevant for the protocol validator
- `upgrades/pool-$id/$version/logs` - logs folder for the protocol validator of that version and pool. Each log file is a run from start to end where the date is the starting date
- `valaccounts` - contains all the valaccount config files with which the KYSOR can run on a pool

#### Binary Installation

If you run with KYSOR and have auto download enabled (which is not recommended for Mainnet and Kaon) you can skip the manual binary installation. If you want to run the binaries with or without KYSOR you have to install them manually.

Depending on the runtime the binary installation differs. For Cosmos Hub we have to install the binary from the
@kyvejs/tendermint-bsync runtime.

#### Build from source

The first option to install the binary is to build it from source. For that you have to execute the following
commands:

```bash
git clone git@github.com:KYVENetwork/kyvejs.git
cd kyvejs
```

If you want to build a specific version you can checkout the tag and continue from the version branch.
If you want to build the latest version you can skip this step.

```bash
git checkout tags/@kyvejs/tendermint-bsync@x.x.x -b x.x.x
```

After you have cloned the project and have the desired version the dependencies can be installed and the project build:

```bash
yarn install
yarn setup
```

Finally, you can build the runtime binaries.

**INFO**: During the binary build log warnings can occur. You can safely ignore them.

```bash
cd integrations/tendermint-bsync
yarn build:binaries
```

You can verify the installation with printing the version:

```bash
./out/kyve-linux-x64 version
```

After the build succeeded you can find the binaries in the `out` folder where you can move them to use
desired location (like KYSOR).

Move binary to KYSOR

```bash
mv ./out/kyve-linux-x64 ~/.kysor/upgrades/pool-<id>/<version>/bin/
```

#### Download prebuilt binary

You can find all prebuilt binaries in the releases of the kyvejs repository. For this specific runtime they
can be found [here](https://github.com/KYVENetwork/kyvejs/releases?q=tendermint).

You can verify the installation with printing the version:

```bash
./kyve-linux-64 version
```

Once you have downloaded the binary for the correct platform and version you can simply unzip them and move them
to your desired location (like KYSOR).

After you have installed the binary you can proceed to move it to the correct location so KYSOR can use it:

```bash
mkdir -p ~/.kysor/upgrades/pool-<id>/<version>/bin
```

```bash
cd ~/.kysor/upgrades/pool-<id>/<version>/bin
```

```bash
wget https://github.com/KYVENetwork/kyvejs/releases/download/%40kyvejs%2F<runtime>%40<version>/kyve-linux-x64.zip
```

```bash
unzip kyve-linux-x64.zip
```

```bash
rm kyve-linux-x64.zip
```

To verify the version and the runtime of the binary simply call the version command:

```bash
./kyve-linux-x64 version
```

Move binary to KYSOR

```bash
mv ./out/kyve-linux-x64 ~/.kysor/upgrades/pool-<id>/<version>/bin/
```
