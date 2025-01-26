let enConfig = {
    login: {
        welcome: 'Welcome Back!',
        login: 'Log In',
        register: 'Sign Up',
        forgetPassword: 'Forgot Password?',
        email: 'Email Address',
        username: 'Username',
        nickname: 'Nickname',
        password: 'Password',
        reenterYourPassword: 'Re-enter Password',
        rememberMe: 'Remember Me',
        loginSuccess: 'Login Successful',
        usernameEtc: 'Username or Email',
        alreadyHaveAccount: 'Already have an account?',
        createAccount: 'Create a New Account',
        redirect: 'You will be redirected to the homepage in 3 seconds.',
        goToHome: 'Go to Homepage',
        usernameRule: 'Username must be 6–20 characters long, containing only letters, digits, and underscores. At least one letter is required.',
        usernameDigitLimit: 'Username must be 6–20 characters long.',
        usernameContentLimit: 'Username can only contain letters, digits, and underscores, with at least one letter.',
        usernameTaken: 'This username is already taken.',
        nicknameRule: 'Nickname must be 6–64 characters long and can include letters, digits, punctuation, and special characters.',
        nicknameDigitLimit: 'Nickname must be 6–64 characters long.',
        nicknameContentLimit: 'Nickname can include letters, digits, punctuation, and special characters.',
        passwordRule: 'Password must be 6–32 characters long.',
        passwordDigitLimit: 'Password must be 6–32 characters long.',
        passwordContentLimit: 'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and no spaces.',
        rePasswordRule: 'Please re-enter your password.',
        rePasswordContentLimit: 'Passwords do not match.',
        emailContentLimit: 'Please enter a valid email address.',
        emailTaken: 'This email is already in use.',
        locationOrCountry: 'Location or Country',
        locationContentLimit: 'Please select your location or country.',
        chooseLanguage: 'Select the languages you know and want to learn.',
        languageRule: 'Your selected languages and proficiency levels will influence the posts and recommendations you see.',
        addALanguage: 'Add a Language',
        languageProficiencyInfo: '⭐: Beginner. You understand basic vocabulary and phrases but struggle with communication.\n⭐⭐: Elementary. You can handle basic conversations but need improvement in grammar and vocabulary.\n⭐⭐⭐: Intermediate. You can communicate fluently in everyday situations but still need practice with complex topics.\n⭐⭐⭐⭐: Advanced. You have a strong command of the language, though occasional errors may occur.\n⭐⭐⭐⭐⭐: Native-like. You are fluent, understand complex contexts, and communicate confidently in any situation.',
        proficiency: 'Proficiency',
        native: 'Native Speaker',
        languageContentLimit: 'You must add at least one language.',
        registerSuccess: 'Registration Successful!',
        continueYourRegistration: 'Continue Registration',
    },
    common: {
        home: 'Home',
        chat: 'Chat',
        bookmark: 'Bookmark',
        me: 'Me',
        error: 'Error',
        confirm: 'Confirm',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        reset: 'Reset',
        save: 'Save',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish',
        skip: 'Skip',
        previousStep: 'Previous Step',
        nextStep: 'Next Step',
        finishStep: 'Finish Step',
        skipStep: 'Skip Step',
        skipAll: 'Skip All',
        finishAll: 'Finish All',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        followSystem: 'Follow System',
        theme: 'Theme',
        language: 'Language',
        rule: 'Rule',
        optional: 'Optional',
        loading: 'Loading',
        loadingWithDots: 'Loading...',
        type: 'Type',
        translate: 'Translate',
        optimize: 'Optimize',
        explain: 'Explain',
        translation: 'Translation',
        explanation: 'Explanation',
        lookUp: 'Look Up',
        translateFrom: 'Translate from {lang}',
        pronounce: 'Pronounce',
        originalText: 'Original',
    },
    post: {
        post: 'Post',
        postPlaceholder: 'What\'s on your mind?',
        titleNotEmpty: 'Title is required for question posts.',
        titleLengthLimit: 'Title can be up to 255 characters long.',
        contentLengthLimit: 'Content can be up to 65,535 characters long.',
        titleRule: 'Use up to 255 characters to describe your post briefly and clearly.',
        typeRule: 'For normal posts, the title is optional. For questions, a title is required.',
        contentRule: 'Content should be in Markdown format and up to 65,535 characters.',
        question: 'Question',
        addAComment: 'Add a comment',
        comment: 'Comment',
        comments: 'Comments',
        commentNotBlank: 'Comment cannot be empty.',
        commentContentLimit: 'Comment content limit',
        addImage: 'Add Images',
        addVoice: 'Add Voice Messages',
        hasMore: 'See more...',
        innerComment: 'Internal Comment',
        selectType: 'Select Post Type',
        normal: 'Normal',
        normalDesc: 'Share your daily life and connect with native speakers.',
        questionDesc: 'Ask a question with a title and details. Don\'t forget to mark the best answer with a green checkmark!',
        article: 'Article',
        articleDesc: 'Articles allow you to write formatted content in Markdown, perfect for structured writing or summaries.',
        menu: 'Menu',
        bookmark: 'Bookmark',
        navi: 'Navi',
        report: 'Report',
        containLanguages: 'What languages does this post mainly contain?',
        next: 'Next',
        back: 'Back',
        selectedLanguage: 'Selected Languages',
        title: 'Title',
        titleOptional: 'Title (Optional)',
        rule: 'Rule',
        normalRule: '1. Title is optional. Maximum length is 250 characters.\n2. Maximum of 30 blocks, 10 image blocks, and 10 voice messages.\n3. Content length cannot exceed 65,530 characters.',
        questionRule: '1. Title is required. Maximum length is 250 characters.\n2. Maximum of 30 blocks, 10 image blocks, and 10 voice messages.\n3. Content length cannot exceed 65,530 characters.',
    },
    composeComment: {
        title: 'Comment',
        compare: 'Compare',
        placeholder: 'Write your comment...',
        compareOldValue: 'Original Text',
        compareNewValue: 'Revised Text',
        compareOutput: 'Comparison Result',
        confirm: 'Confirm',
        cancel: 'Cancel',
        imageMenu: 'Image',
        voiceMenu: 'Voice',
        compareMenu: 'Compare',
        add: 'Add',
        change: 'Change',
        delete: 'Delete',
        record: 'Record',
        upload: 'Upload',
    },
    voiceRecorder: {
        title: 'Voice Recorder',
        start: 'Start Recording',
        stop: 'Stop Recording',
        limit: 'Maximum length is 30 seconds. Recording will stop automatically if exceeded. Only one voice message is allowed. If there\'s an error, unplug and reconnect your microphone.',
        send: 'Send',
    },
    user: {
        following: 'Following',
        followers: 'Followers',
        follow: 'Follow',
        followBack: 'Follow Back',
        unfollow: 'Unfollow',
        mutualFollowing: 'Mutual Following',
        oops: 'Oops',
        bannedPrompt: 'It seems you are blocked by {\'@\'}{username}.',
        unblock: 'Unblock',
    },
    lang: {
        en: 'English',
        zh: 'Chinese',
        ko: 'Korean',
        ja: 'Japanese',
        fr: 'French',
        enAbbr: 'ENG',
        zhAbbr: 'CHN',
        koAbbr: 'KOR',
        jaAbbr: 'JPN',
        frAbbr: 'FRA',
    },
    imageUploader: {
        send: 'Send',
        add: 'Add',
        change: 'Change',
        images: 'Images',
    },
    bookmark: {
        bookmark: 'Bookmark',
        addToBookmark: 'Add to Bookmarks',
        editNote: 'Edit Note',
        remove: 'Remove',
        post: 'Post',
        comment: 'Comment',
        note: 'Note',
        close: 'Close',
        update: 'Update',
        text: 'Text'
    },
    chat: {
        chat: 'Chat',
        message: 'Message',
        sending: 'Sending...',
        getOriginalImage: 'Get Original Image',
        contact: 'Contact',
    },
    navi: {
        quote: 'Quote',
        question: 'Question',
        ability: 'Ability',
        translate: 'Translate',
        explain: 'Explain',
        ask: 'Ask',
        enterYourQuestion: 'Enter your question...',
        originalText: 'Original',
        enterHere: 'Enter here...',
        retry: 'Retry',
        pronounce: 'Pronounce',
        autoDetect: 'Auto Detect',
        translation: 'Translation',
        back: 'Back',
        explainInputPlaceholder: 'Enter text you want explained...',
        pronounceInputPlaceholder: 'Enter text you want pronounced...',
        pronunciation: 'Pronunciation',
        content: 'Content',
        close: 'Close',
        explanation: 'Explanation',
        wordInputPlaceholder: 'en',
        search: 'Search',
        dictionary: 'Dictionary',
        all: 'All',
        word: 'Word'
    },
    more: {
        language: 'Language',
        logout: 'Logout',
        editProfile: 'Edit Profile',
        clickOneMoreTimeToLogout: 'Click again to log out',
        theme: 'Theme',
    },
    editor: {
        originalText: 'Original Text',
        revisedText: 'Revised Text',
        raw: 'Raw',
        rendered: 'Rendered',
        output: 'Output',
        image: 'Image',
        caption: 'Caption',
        voice: 'Voice',
        record: 'Record',
        noRecordingFound: 'No recording found.',
        upload: 'Upload',
        preview: 'Preview',
        text: 'Text',
        posting: 'Posting...',
    }
}

export default enConfig;