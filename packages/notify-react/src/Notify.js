import React, { Component, PropTypes } from 'react';

import 'whatwg-fetch';

const paramify = (params, encoder = encodeURIComponent) => {
    const query = Object.keys(params)
        .map(key => `${encoder(key)}=${encoder(params[key])}`)
        .join('&');

    return query.length > 0
        ? `?${query}`
        : '';
};

const transformNotifications = (json) => {
    const { logoUrl: image, headline: title, textMessage: text, actionUrl: url, actionText } = json.stickyBottom;

    return {
        image,
        title,
        text,
        link: {
            url,
            title: actionText,
        },
    };
};

const fetchNotifications = ({ exclude, userInfo, sid, segment, bid }) => {
    return fetch(
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

        this.state = { status: 'initialized' };
    }

    fetchNotifications(args) {
        fetchNotifications(args)
        .then(json => {
            this.setState({
                status: 'fetched',
                data: {
                    ...transformNotifications(json)
                },
            });
            console.log(json);
        })
        .catch(error => console.log(error));
    }

    render() {
        const { theme } = this.props;
        const { status } = this.state;

        if (status === 'fetched') {
            const { data } = this.state;

            return (
                <div className={ theme.container }>
                    <img src={ data.image } className={ theme.image }/>
                    <h3 className={ theme.title }>{ data.title }</h3>
                    <p className={ theme.text }>{ data.text }</p>
                    <a href={ data.link.url } className={ theme.link }>{ data.link.title }</a>
                </div>
            );
        }

        return (<a href="">
            <h3>Notify</h3>
            <p>{ status }</p>
        </a>);
    }
}

Notify.propTypes = {
    theme: PropTypes.shape({
        container: PropTypes.string,
        image: PropTypes.string,
        title: PropTypes.string,
        text: PropTypes.string,
        link: PropTypes.string,
    })
};

Notify.defaultProps = {
    theme: {},
};

export default Notify;
