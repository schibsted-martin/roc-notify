import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch';

import { resolve, paramify, persistClosedNotifications, getPersistedClosedNotifications } from './utils';

const STATUS = {
    INITIALIZED: 'initialized',
    GOT_NOTIFICATION: 'fetched',
    GOT_NOTHING: 'empty',
    GOT_ERROR: 'error',
    USER_CLICKED: 'clicked',
    USER_CLOSED: 'closed',
}

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

class Notify extends Component {
    constructor(props) {
        super(props);

        this.state = { status: STATUS.INITIALIZED };
    }

    componentDidMount() {
        this.fetchNotification();
    }

    componentDidUpdate() {
        if (this.props.onLoad && this.state.status === STATUS.GOT_NOTIFICATION) this.props.onLoad(new Event('custom event'), this.state.data);
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
                status: data ? STATUS.GOT_NOTIFICATION : STATUS.GOT_NOTHING,
                data: {
                    ...transformNotification(data),
                },
            });
        })
        .catch((error) => {
            this.setState({
                status: STATUS.GOT_ERROR,
            });
        });
    }

    handleClick = (e) => {
        if (this.props.onClick) this.props.onClick(e, this.state.data);

        persistClosedNotifications(this.state.data);

        this.setState({
            status: STATUS.USER_CLICKED,
        });
    }

    handleClose = (e) => {
        e.preventDefault();

        if (this.props.onClose) this.props.onClose(e, this.state.data);

        persistClosedNotifications(this.state.data);

        this.setState({
            status: STATUS.USER_CLOSED,
        });
    }

    render() {
        const { type, theme } = this.props;
        const { status, data } = this.state;

        if (status === STATUS.GOT_NOTIFICATION) {
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
    siteCatalystId: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // Could we remove this?
    burtId: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // Could we remove this?
    testSegment: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // Could we remove this?
    onLoad: PropTypes.func,
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
    onLoad: undefined,
    onClick: undefined,
    onClose: undefined,
    environment: 'production',
};

export default Notify;
