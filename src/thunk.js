'use strict';

const {
    fetchRequest,
    fetchSuccess,
    fetchFailure
} = require('./common/action-creators');

/**
 * Redux thunk action creator for making asynchronous API calls. This thunk
 * dispatches at least two actions: the first being the FETCH_REQUEST action,
 * which notifies the UI that fetching is occurring. The second action is dispatched
 * when either the API call succeeds or fails.
 *
 * More on Redux Thunk: https://github.com/gaearon/redux-thunk
 *
 * @param  {string}     name        Entity name
 * @param  {Promise}    promise     Promise that loads data from an external source (e.g. OrderService.getOrders())
 * @param  {boolean}    silent      Disable the FETCH_REQUEST action,
 * @return {function}               A function that loads data from an external source, and dispatches actions
 */
module.exports = function loadEntity(
    name,
    promise,
    silent = false
) {
    if (!name || typeof name !== 'string') throw new Error('name is required and must be a String');
    if (!promise || !promise.then) throw new Error('promise is required and must be a Promise');

    return (dispatch) => {

        if (!silent) {
            /**
             * When fetchRequest is dispatched, the `isFetching` property
             * on the entity is set to `true`. The UI can hook into this
             * property, and optionally display a spinner or loading
             * indicator to the end-user.
             *
             * A reason to pass `silent` as true would be to
             * inhibit this loading indicator, if configured. For instance,
             * perhaps only the spinner should show when the component is
             * mounting, but subsequent updates to the entity are done
             * silently in the background.
             */
            dispatch(fetchRequest(name)());
        }

        return promise
            .then(data => {
                // Dispatch success to update model state
                dispatch(
                    fetchSuccess(name)(data, Date.now())
                )
            })
            .catch(error => {
                // Dispatch failure to notify UI
                dispatch(
                    fetchFailure(name)(error, Date.now())
                )
            })
    }
};