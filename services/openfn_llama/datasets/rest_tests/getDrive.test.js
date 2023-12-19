import { getDrive } from './getDrive.js';
import { MockAgent, fixtures } from './mockAgent.js';
import { expect } from 'chai';
import { setGlobalDispatcher } from 'undici';

setGlobalDispatcher(MockAgent);

describe('getDrive', () => {
    it('should get a drive by id and set it to state', async () => {
      const state = {
        configuration: {
          accessToken: fixtures.accessToken,
        },
      };
  
      const finalState = await execute(
        getDrive({ id: 'b!YXzpkoLwR06bxC8tNdg71m_' }, undefined, state => {
          // write the drives object back to state before it gets cleaned up
          state.result = state.drives;
          return state;
        })
      )(state);
  
      expect(finalState.result.default).to.eql(fixtures.driveResponse);
    });
  
    it('should get a named drive by id and set it to state', async () => {
      const state = {
        configuration: {
          accessToken: fixtures.accessToken,
        },
      };
  
      const finalState = await execute(
        getDrive({ id: 'b!YXzpkoLwR06bxC8tNdg71m_' }, 'mydrive', state => {
          // write the drives object back to state before it gets cleaned up
          state.result = state.drives;
          return state;
        })
      )(state);
  
      expect(finalState.result.mydrive).to.eql(fixtures.driveResponse);
    });
  
    it('should get the default drive for a site', async () => {
      const state = {
        configuration: {
          accessToken: fixtures.accessToken,
        },
      };
  
      const finalState = await execute(
        getDrive(
          { id: 'openfn.sharepoint.com', owner: 'sites' },
          undefined,
          state => {
            // write the drives object back to state before it gets cleaned up
            state.result = state.drives;
            return state;
          }
        )
      )(state);
  
      expect(finalState.result.default).to.eql(fixtures.driveResponse);
    });
    it('should throws 400 error', async () => {
      const state = {
        configuration: {
          accessToken: fixtures.accessToken,
        },
      };
  
      await execute(
        getDrive({ id: 'noAccess', owner: 'sites' })(state).catch(e => {
          expect(e.message).to.contain(
            fixtures.invalidRequestResponse.error.message
          );
        })
      )(state);
    });
  
    it('throws 401 error with invalidToken message', async () => {
      const state = {
        configuration: {
          accessToken: fixtures.invalidToken,
        },
      };
  
      await execute(
        getDrive({ id: 'openfn.sharepoint.com', owner: 'sites' })(state).catch(
          e => {
            expect(e.message).to.contain(
              fixtures.invalidTokenResponse.error.message
            );
          }
        )
      )(state);
    });
  
    it('should throws 401 error with expiredToken message', async () => {
      const state = {
        configuration: {
          accessToken: fixtures.expiredToken,
        },
      };
  
      await execute(
        getDrive({ id: 'openfn.sharepoint.com', owner: 'sites' })(state).catch(
          e => {
            expect(e.message).to.contain(
              fixtures.expiredTokenResponse.error.message
            );
          }
        )
      )(state);
    });
  });