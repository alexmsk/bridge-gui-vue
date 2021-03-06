/* eslint no-undef: ["error", { "typeof": false }] */

import {
  SET_PRIVATE_KEY,
  SET_PUBLIC_KEY,
  CLEAR_KEYS
} from '@/store/mutation-types';
import errors from 'storj-service-error-types';
import Promise from 'bluebird';
import { lStorage } from '@/utils';

const state = {
  privateKey: lStorage.retrieve('privateKey'),
  publicKey: lStorage.retrieve('publicKey')
};

const mutations = {
  /**
   * Saves private key to store and also sets it on Local Storage
   */
  [SET_PRIVATE_KEY] (state, privateKey) {
    state.privateKey = privateKey;

    lStorage.save('privateKey', privateKey);
  },

  [SET_PUBLIC_KEY] (state, publicKey) {
    state.publicKey = publicKey;

    lStorage.save('publicKey', publicKey);
  },

  [CLEAR_KEYS] (state) {
    state.privateKey = '';
    state.publicKey = '';

    lStorage.remove('privateKey');
    lStorage.remove('publicKey');
  }
};

const actions = {
  generateKeypair ({ commit, state, rootState }, storj) {
    return new Promise((resolve, reject) => {
      if (!storj) {
        return reject(new errors.BadRequestError('No Storj instance'));
      }

      const keypair = storj.generateKeyPair();

      commit(SET_PRIVATE_KEY, keypair.getPrivateKey());
      commit(SET_PUBLIC_KEY, keypair.getPublicKey());

      return resolve(keypair);
    });
  },

  /**
   * Registers public key with Storj network
  */
  registerKey ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      if (!data.storj) {
        return reject(new errors.BadRequestError('No Storj instance'));
      }

      return data.storj.registerKey(data.publicKey, function (err) {
        if (err) {
          return reject(new errors.InternalError(err));
        }
        return resolve();
      });
    });
  },

  /**
   * Unregister public key with Storj network and clear private key from
   * Vuex state
   */
  unregisterKey ({ commit, dispatch }, storj) {
    return new Promise((resolve, reject) => {
      const privateKey = lStorage.retrieve('privateKey');
      const publicKey = lStorage.retrieve('publicKey');

      if (!privateKey || !publicKey) {
        return resolve();
      }

      storj.removeKey(publicKey, function (err) {
        if (err) {
          if (err.toString() === 'Error: Public key was not found') {
            return resolve('Private key not found');
          }
          return reject(new errors.InternalError(err.message));
        }
        commit(CLEAR_KEYS);
        return resolve('Private key removed');
      });
    });
  }
};

export default {
  state,
  mutations,
  actions
};
