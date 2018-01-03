export default {
    mounted () {
        if (window) {
            const vm = this;
            document.addEventListener('click', (e) => {
                if (vm.$el && e.path && e.path.indexOf(vm.$el) < 0) {
                    vm.$emit('clickOut');
                }
            });
        }
    }
};
