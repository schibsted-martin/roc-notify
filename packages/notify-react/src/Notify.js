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

const transformNotification = (type, json) => {
    if (json[type]) {
        const { logoUrl: image, headline: title, textMessage: message, actionUrl: url, actionText } = json[type];

        return {
            image,
            title,
            message,
            link: {
                url,
                title: actionText,
            },
        };
    }

    return {};
};

const fetchNotification = ({ exclude, userInfo, sid, segment, bid }) => {
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

        this.fetchNotification();

        this.state = { status: 'initialized' };
    }

    fetchNotification() {
        const { type } = this.props;

        fetchNotification({
            exclude: [],
            userInfo: 'MCwCFBzGXH2LC3yDGsLzKuaEJwDzYv4zAhRNbImxLIz2rFP/7olYy2n1hKKtwQ==.eyJ1c2VySWQiOjExMTAwMDM1LCJuYW1lIjoibWFydGluX2RhbmllbHNzb24iLCJzZXJ2aWNlcyI6W10sInRpbWUiOjE0ODg4ODg1ODB9',
            sid: '2B9398068530B4E6-40000301A00912B5',
            segment: 17,
            bid: '',
        })
        .then(json => {
            this.setState({
                status: 'fetched',
                data: {
                    ...transformNotification(type, json)
                },
            });
            console.log(json);
        })
        .catch(error => console.log(error));
    }

    handleClick() {
        this.onClick && this.onClick();
    }

    handleClose(e) {
        e.preventDefault()

        this.onClose && this.onClose();
    }

    render() {
        const { type, theme } = this.props;
        const { status, data } = this.state;

        if (status === 'fetched') {
            if (['fishStick', 'fishStickClosable'].includes(type)) {
                return <div>IQ fiskpinne</div>;
            } else {
                return (
                    <div className={ theme.root }>
                        <div className={ theme.container }>
                            <img src={ data.image } className={ theme.image }/>
                            <span className={ theme.text }>
                                <h3 className={ theme.title }>{ data.title }</h3>
                                <p className={ theme.message }>{ data.message }</p>
                            </span>
                            <a href={ data.link.url } onClick={ this.handleClick } className={ theme.link }>{ data.link.title }</a>
                            <a href="#" onClick={ this.handleClose } className={ theme.close }>Close</a>
                        </div>
                    </div>
                );
            }
        }

        return (
            <div className={ theme.root }>
                <h3>Notify</h3>
                <p>{ status }</p>
            </div>
        );
    }
}

Notify.propTypes = {
    type: PropTypes.oneOf(['stickyBottom', 'fishStick', 'fishStickClosable']),
    theme: PropTypes.shape({
        root: PropTypes.string,
        container: PropTypes.string,
        image: PropTypes.string,
        text: PropTypes.string,
        title: PropTypes.string,
        message: PropTypes.string,
        link: PropTypes.string,
        close: PropTypes.string,
    }),
    onClick: PropTypes.func,
    onClose: PropTypes.func,
};

Notify.defaultProps = {
    type: 'stickyBottom',
    theme: {},
};

export default Notify;
