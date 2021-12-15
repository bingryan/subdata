#!/usr/bin/env node
'use strict'

const {program} = require('commander');
const fs = require("fs");
const {ApiPromise, WsProvider} = require('@polkadot/api')
const {Keyring} = require("@polkadot/keyring");
const job = require('./utils')


program
    .version('1.0.0')

program
    .option('-c, --config <config>', 'Path to config file.\t')
    .option('-f, --format <format>', 'config file format [default: json]')
    .option('-t, --types <types>', 'custom datatype from chain')

program.parse(process.argv)

const options = program.opts()

async function start(options) {
    let config, types, typesFile;
    try {
        const configFile = fs.readFileSync(options.config, {encoding: 'utf8', flag: 'r'});
        if (options.types) {
            typesFile = fs.readFileSync(options.types, {encoding: 'utf8', flag: 'r'});
        }
        config = JSON.parse(configFile || '[]');
        types = JSON.parse(typesFile || '[]');
    } catch (error) {
        return console.log("parse file failed:", error);
    }

    if (!config.meta.endpoint) {
        return console.log('Missing chain endpoint');
    }

    if (!config.meta.sudo) {
        return console.log('Missing root info');
    }


    const wsProvider = new WsProvider(config.meta.endpoint);
    const api = await ApiPromise.create({
        provider: wsProvider,
        types: types
    });

    let keyring = new Keyring({
        ss58Format: config.meta.sudo.ss58Format || 42,
        type: config.meta.sudo.type || "sr25519"
    });

    let root = keyring.addFromUri(config.meta.sudo.uri, {}, config.meta.sudo.type);

    if (api.isConnected) {
        console.log("generating......")
        job(config, api, root);
    }
}

start(options);


