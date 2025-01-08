<?php
/**
 * @copyright Copyright (c) PutYourLightsOn
 */

/**
 * Datastar config.php
 *
 * This file exists only as a template for the Datastar settings.
 * It does nothing on its own.
 *
 * Don't edit this file, instead copy it to 'craft/config' as 'datastar.php'
 * and make your changes there to override default settings.
 *
 * Once copied to 'craft/config', this file will be multi-environment aware as
 * well, so you can have different settings groups for each environment, just as
 * you do for 'general.php'
 */

return [
    '*' => [
        /**
         * Whether to register the Datastar script on the front-end.
         */
        'registerScript' => true,

        /**
         * The name of the signals variable that will be injected into Datastar templates.
         */
        'signalsVariableName' => 'signals',

        /**
         * The event options to override the Datastar defaults. Null values will be ignored.
         */
        'defaultEventOptions' => [
            'retryDuration' => null,
        ],

        /**
         * The fragment options to override the Datastar defaults. Null values will be ignored.
         */
        'defaultFragmentOptions' => [
            'settleDuration' => null,
            'useViewTransition' => true,
        ],

        /**
         * The signal options to override the Datastar defaults. Null values will be ignored.
         */
        'defaultSignalOptions' => [
            'onlyIfMissing' => null,
        ],

        /**
         * The execute script options to override the Datastar defaults. Null values will be ignored.
         */
        'defaultExecuteScriptOptions' => [
            'autoRemove' => null,
            'attributes' => null,
        ],
    ],
];
