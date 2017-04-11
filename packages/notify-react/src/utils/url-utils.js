export const paramify = (params, encoder = encodeURIComponent) => {
    const query = Object.keys(params)
        .map(key => (Array.isArray(params[key]) && params[key].length
            ? params[key].map(value => `${encoder(key)}=${encoder(value)}`).join('&')
            : `${encoder(key)}=${encoder(params[key])}`))
        .join('&');

    return query.length > 0
        ? `?${query}`
        : '';
};
