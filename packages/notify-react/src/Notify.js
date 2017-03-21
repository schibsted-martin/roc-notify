import React, { Component } from 'react';

import 'whatwg-fetch';

const paramify = (params, encoder = encodeURIComponent) => {
    const query = Object.keys(params)
        .map(key => `${encoder(key)}=${encoder(params[key])}`)
        .join('&');

    return query.length > 0
        ? `?${query}`
        : '';
};

class Notify extends Component {
    constructor(props) {
        super(props);

        this.fetchNotifications({
            exclude: [],
            userInfo: 'MCwCFBzGXH2LC3yDGsLzKuaEJwDzYv4zAhRNbImxLIz2rFP/7olYy2n1hKKtwQ==.eyJ1c2VySWQiOjExMTAwMDM1LCJuYW1lIjoibWFydGluX2RhbmllbHNzb24iLCJzZXJ2aWNlcyI6W10sInRpbWUiOjE0ODg4ODg1ODB9',
            sid: '2B9398068530B4E6-40000301A00912B5',
            segment: 17,
            bid: '',
        });

        this.state = { last: 'init' };
    }

    fetchNotifications({ exclude, userInfo, sid, segment, bid }) {
        fetch(
            `https://crossorigin.me/https://ab-web-notifications-stage.herokuapp.com/crm/notifications${paramify({
                exclude,
                userInfo,
                sid,
                segment,
                bid,
            }, (value) => value)}`,
            {
                method: 'GET',
            }
        )
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('ERR');
        })
        .then(json => {
            this.setState({ last: 'success', data: { ...json.stickyBottom } });
            console.log(json);
        })
        .catch(error => console.log(error));
    }

    render() {
        const { last } = this.state;

        if (last === 'success') {
            const { data } = this.state;

            return (
                <div>
                    <img src={ data.logoUrl }/>
                    <h3>{ data.headline }</h3>
                    <p>{ data.textMessage }</p>
                    <a href={ data.actionUrl }>{ data.actionText }</a>
                </div>
            );
        }

        return (<a href="">
            <h3>Notify</h3>
            <p>{ last }</p>
        </a>);
    }
}

export default Notify;
