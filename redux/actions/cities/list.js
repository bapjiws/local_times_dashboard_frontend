import {
    ADD_CITY,
    DELETE_CITY,
    RESTORE_DELETED_CITY,
    CACHE_DELETED_CITY,
} from '../actionTypes';

import { showNotification, changeNotificationText } from './notification';

import axios from 'axios';

// Wrap returned object in parens so it's interpreted as an object expression and not as a block of code.
export const addCity = city => ({
    type: ADD_CITY,
    payload: {
        city
    }
});

const deleteCity = place => ({
    type: DELETE_CITY,
    payload: {
        place
    }
});

const cacheDeletedCity = cityItem => ({
    type: CACHE_DELETED_CITY,
    payload: {
        cityItem
    }
});

export const deleteAndCacheCityAndNotify = city => {
    return (dispatch, getState) => {
        dispatch(deleteCity(city.place));
        dispatch(cacheDeletedCity(city));
        dispatch(showNotification());

        let deletedCity = getState().deletedCity.cityItem.city;

        let notification = `${deletedCity.accentName}, ${deletedCity.country} removed from the list`;
        console.log('notification: ', notification);

        dispatch(changeNotificationText(notification));

    }
};

const restoreCity = city => ({
    type: RESTORE_DELETED_CITY,
    payload: {
        city
    }
});

export const restoreDeletedCityAndNotify = city => {
    return dispatch => {

    }

};

export const addLocationAndItsLocalTime = id => {

    // See: http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
    let timestamp = Math.floor(Date.now() / 1000);
    const apiKey = 'AIzaSyCvwQxLACrb-Dr70mBIKH7DhLIMOgJXUX8';

    // TODO: can we use all here?
    return (dispatch, getState) => {

        if (getState().cityList.find(cityItem => cityItem.city.id == id) !== undefined) {
            // TODO: dispatch a popup?
            return;
        }

        getCityById(id)
        .then(
            response => {
                // console.log("Got city by id: ", response.data);

                // TODO: create a City model and parseJson method for it
                let city = response.data;

                getTimezone(city, timestamp, apiKey)
                .then(
                    response => {
                        // console.log('Got response from Google Maps API: ', response.data);
                        city.timeZoneId = response.data.timeZoneId;
                        city.timeZoneName = response.data.timeZoneName;
                        dispatch(addCity(city));
                })
            }
        )
        .catch(error => console.log(`Couldn't add location and its local time: ${error}`));
    }
};

const getCityById = id => {
    return axios.get(`http://localhost:8888/api/city/${id}`)
};

const getTimezone = (city, timestamp, apiKey) => {
    // https://developers.google.com/maps/documentation/timezone/intro
    return axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${city.latitude},${city.longitude}
                    &timestamp=${timestamp}&key=${apiKey}`)
};