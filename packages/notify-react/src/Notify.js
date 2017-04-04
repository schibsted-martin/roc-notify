import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch';
import localStorage from '@aftonbladet/local-storage';

const resolve = (param) => {
    if ('function' === typeof param) return param();

    return param;
}

const paramify = (params, encoder = encodeURIComponent) => {
    const query = Object.keys(params)
        .map(key => {
            return Array.isArray(params[key]) && params[key].length
                ? params[key].map(value => `${encoder(key)}=${encoder(value)}`).join('&')
                : `${encoder(key)}=${encoder(params[key])}`;
        })
        .join('&');

    return query.length > 0
        ? `?${query}`
        : '';
};

const transformNotification = (type, json) => {
    if (json[type]) {
        const { id, logoUrl: image, headline: title, textMessage: paragraph, actionUrl: url, actionText } = json[type];

        return {
            id,
            image,
            title,
            paragraph,
            link: {
                url,
                title: actionText,
            },
        };
    }

    return {};
};

const fetchNotification = ({ exclude, user: userInfo, siteCatalystId: sid, burtId: bid, testSegment: segment, environment }) => {
    return fetch(
        `https://crossorigin.me/https://ab-web-notifications${environment !== 'production' ? `-${environment}` : ''}.herokuapp.com/crm/notifications${paramify({ exclude, userInfo, sid, bid, segment }, (value) => value)}`,
        {
            method: 'GET',
        }
    )
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to load resource');
    })
};

const persistClosedNotifications = (id) => {
    if (id) {
        const excluded = localStorage.readValue('notify-exclude') || [];

        if (!excluded.includes(id)) excluded.push(id);

        localStorage.persistValue('notify-exclude', excluded);
    }
};

const getPersistedClosedNotifications = () => localStorage.readValue('notify-exclude', 10 /*(1000 * 60 * 60 * 24)*/) || [];// Uncomment when done.

class Notify extends Component {
    constructor(props) {
        super(props);

        this.fetchNotification();

        this.state = { status: 'initialized' };
    }

    fetchNotification() {
        const { type, user, siteCatalystId, burtId, testSegment, environment } = this.props;

        fetchNotification({
            exclude: getPersistedClosedNotifications().map(encodeURIComponent),
            user: resolve(user),
            siteCatalystId: resolve(siteCatalystId),
            burtId: resolve(burtId),
            testSegment: resolve(testSegment),
            environment,
        })
        .then(json => {
            this.setState({
                status: json[type] ? 'fetched' : 'empty',
                data: {
                    ...transformNotification(type, json)
                },
            });
        })
        .catch(error => console.log(error));
    }

    handleClick = (e) => {
        this.props.onClick && this.props.onClick(e, this.state);

        persistClosedNotifications(this.state.data && this.state.data.id);

        this.setState({
            status: 'clicked',
        })
    }

    handleClose = (e) => {
        e.preventDefault()

        this.props.onClose && this.props.onClose(e, this.state);

        persistClosedNotifications(this.state.data && this.state.data.id);

        this.setState({
            status: 'closed',
        })
    }

    render() {
        const { type, theme } = this.props;
        const { status, data } = this.state;

        if (status === 'fetched') {
            if (['fishStick', 'fishStickClosable'].includes(type)) {
                // teaser?
                return (
                    <a href={ data.link.url } onClick={ this.handleClick } className={ theme.inline }>
                        <h3 className={ theme.title }>{ data.title }</h3>
                        <p className={ theme.paragraph }>{ data.paragraph }</p>
                    </a>
                );
            } else {
                return (
                    <div className={ theme.popup }>
                        <div className={ theme.container }>
                            <img src={ data.image } className={ theme.image }/>
                            <span className={ theme.message }>
                                <h3 className={ theme.title }>{ data.title }</h3>
                                <p className={ theme.paragraph }>{ data.paragraph }</p>
                            </span>
                            <a href={ data.link.url } onClick={ this.handleClick } className={ theme.link }>{ data.link.title }</a>
                            <a href="#" onClick={ this.handleClose } className={ theme.close }>Close</a>
                        </div>
                    </div>
                );
            }
        }

        return (
            <pre>
                Notify status: { status }
            </pre>
        );
    }
}

Notify.propTypes = {
    type: PropTypes.oneOf(['stickyBottom', 'fishStick', 'fishStickClosable']),
    theme: PropTypes.shape({
        font: PropTypes.string,
        inline: PropTypes.string,
        popup: PropTypes.string,
        container: PropTypes.string,
        image: PropTypes.string,
        text: PropTypes.string,
        title: PropTypes.string,
        message: PropTypes.string,
        link: PropTypes.string,
        close: PropTypes.string,
    }).isRequired,
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    siteCatalystId: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    burtId: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    testSegment: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    environment: PropTypes.oneOf(['production', 'stage']),
};

Notify.defaultProps = {
    type: 'stickyBottom',
    theme: {},
    user: '',
    siteCatalystId: '',
    burtId: '',
    testSegment: '',
    environment: 'production',
};

export default Notify;
