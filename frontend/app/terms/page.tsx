import React from 'react';
import Head from 'next/head';

const ConditionsUtilisation = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-lexend">
      <Head>
        <title>Conditions d'utilisation</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo de l'application" className="h-32" />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Conditions d'utilisation</h1>

        <div className="prose prose-lg text-gray-700">
          <h2 className="text-xl font-semibold mt-6">1. Acceptation des conditions</h2>
          <p>
            En utilisant cette application de rencontre, vous acceptez sans réserve les présentes conditions d'utilisation.
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Géolocalisation obligatoire</h2>
          <p>
            Notre application nécessite l'activation permanente de la géolocalisation pour fonctionner correctement.
            En acceptant ces conditions, vous autorisez l'application à accéder à votre position géographique en temps réel.
          </p>

          <h2 className="text-xl font-semibold mt-6">3. Utilisation du service</h2>
          <p>
            Vous vous engagez à utiliser ce service de rencontre de manière responsable et dans le respect des autres utilisateurs.
            Tout comportement inapproprié (harcèlement, propos offensants, etc.) pourra entraîner la suspension de votre compte.
          </p>

          <h2 className="text-xl font-semibold mt-6">4. Données personnelles</h2>
          <p>
            Vos données de géolocalisation sont utilisées uniquement pour le fonctionnement de l'application et ne sont pas partagées avec des tiers sans votre consentement.
            Vous pouvez consulter notre politique de confidentialité pour plus d'informations.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Âge minimum</h2>
          <p>
            L'utilisation de cette application est réservée aux personnes majeures (18 ans ou plus selon la législation en vigueur dans votre pays).
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Modifications des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications prendront effet dès leur publication dans l'application.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à l'adresse suivante : contact@application-rencontre.com
          </p>

          <p className="mt-8 italic">
            Date de dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConditionsUtilisation;