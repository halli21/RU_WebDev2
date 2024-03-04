const common = () => {
    return {
        fetchWithPredicate: (predicate, resource, key) => {
            return predicate ? resource[key].filter(predicate) : resource[key];
        }
    };
};

module.exports = common();
