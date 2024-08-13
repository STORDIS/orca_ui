// NavigationService.js
let navigate;

export const setNavigate = (navFunction) => {
    navigate = navFunction;
};

export const getNavigate = () => navigate;
