
const state = {
    statistics: {
        shippingCountForWait: 0,
        saleOrderAuditCount: 0
    }
}
// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
    setStatistics(state, data) {
        state.statistics = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}