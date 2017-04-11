export const paramify = (params, encoder = encodeURIComponent) => { // eslint-disable-line import/prefer-default-export, max-len
    const query = Object.keys(params)
        .map(key => (Array.isArray(params[key]) && params[key].length
            ? params[key].map(value => `${encoder(key)}=${encoder(value)}`).join('&')
            : `${encoder(key)}=${encoder(params[key])}`))
        .join('&');

    return query.length > 0
        ? `?${query}`
        : '';
};
