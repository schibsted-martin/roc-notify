import React, { Component, PropTypes } from 'react';
import { canUseDOM } from 'exenv';
import 'whatwg-fetch';

const localStorage = canUseDOM ? require('@aftonbladet/local-storage') : {};

const resolve = (param) => {
    if (typeof param === 'function') return param();

    return param;
};

const paramify = (params, encoder = encodeURIComponent) => {
    const query = Object.keys(params)
        .map(key => (Array.isArray(params[key]) && params[key].length
            ? params[key].map(value => `${encoder(key)}=${encoder(value)}`).join('&')
            : `${encoder(key)}=${encoder(params[key])}`))
        .join('&');

    return query.length > 0
        ? `?${query}`
        : '';
};

const transformNotification = (data) => {
    if (data) {
        const {
            id,
            logoUrl: image,
            headline: title,
            textMessage: paragraph,
            actionUrl: url,
            actionText,
            theme,
        } = data;

        return {
            id,
            image,
            title,
            paragraph,
            link: {
                url,
                title: actionText,
            },
            variant: theme,
        };
    }

    return {};
};

const fetchNotification = ({
    exclude,
    user: userInfo,
    siteCatalystId: sid,
    burtId: bid,
    testSegment: segment,
    environment,
}) => fetch( // eslint-disable-line no-undef
    `//ab-web-notifications${environment !== 'production' ? `-${environment}` : ''}.herokuapp.com/crm/notifications${paramify({ exclude, userInfo, sid, bid, segment }, value => value)}`,
    {
        method: 'GET',
    }
)
.then((response) => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Failed to load resource');
});

const persistClosedNotifications = (id) => {
    if (id) {
        if (canUseDOM) {
            const excluded = localStorage.readValue('notify-exclude') || [];

            if (!excluded.includes(id)) excluded.push(id);

            localStorage.persistValue('notify-exclude', excluded);
        }
    }
};

const getPersistedClosedNotifications = () => {
    if (canUseDOM) {
        return localStorage.readValue('notify-exclude', 1000 * 60 * 60 * 24) || [];
    }

    return [];
};

class Notify extends Component {
    constructor(props) {
        super(props);

        this.state = { status: 'initialized' };
    }

    componentDidMount() {
        this.fetchNotification();
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
        .then((json) => {
            let data;
            if (type === 'popup') {
                data = json.stickyBottom;
            } else if (type === 'inline') {
                data = json.fishStick || json.fishStickClosable;
            }

            this.setState({
                status: data ? 'fetched' : 'empty',
                data: {
                    ...transformNotification(data),
                },
            });
        })
        .catch(error => console.log(error));
    }

    handleClick = (e) => {
        if (this.props.onClick) this.props.onClick(e, this.state);

        persistClosedNotifications(this.state.data && this.state.data.id);

        this.setState({
            status: 'clicked',
        });
    }

    handleClose = (e) => {
        e.preventDefault();

        if (this.props.onClose) this.props.onClose(e, this.state);

        persistClosedNotifications(this.state.data && this.state.data.id);

        this.setState({
            status: 'closed',
        });
    }

    render() {
        const { type, theme } = this.props;
        const { status, data } = this.state;

        if (status === 'fetched') {
            const { link, title, paragraph, image, variant } = data;

            if (type === 'inline') {
                // teaser?
                return (
                    <a href={link.url} onClick={this.handleClick} className={[theme.inline, theme[`inline--${variant}`]].join(' ')}>
                        <h3 className={theme.title}>{title}</h3>
                        <p className={theme.paragraph}>{paragraph}</p>
                    </a>
                );
            }

            return (
                <div className={theme.popup}>
                    <div className={theme.container}>
                        <img alt="" src={image} className={theme.image} />
                        <span className={theme.message}>
                            <h3 className={theme.title}>{title}</h3>
                            <p className={theme.paragraph}>{paragraph}</p>
                        </span>
                        <a href={link.url} onClick={this.handleClick} className={theme.link}>
                            {link.title}
                        </a>
                        <button href="#" onClick={this.handleClose} className={theme.close}>
                            Close
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    }
}

Notify.propTypes = {
    type: PropTypes.oneOf(['popup', 'inline']),
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
    type: 'popup',
    theme: {},
    user: '',
    siteCatalystId: '',
    burtId: '',
    testSegment: '',
    onClick: undefined,
    onClose: undefined,
    environment: 'production',
};

export default Notify;
