import React from 'react';
import Head from 'next/head';

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-lexend">
      <Head>
        <title>Politique de confidentialité</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo de l'application" className="h-32" />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Politique de confidentialité</h1>

        <div className="prose prose-lg text-gray-700">
          <p className="mb-6">
            Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre application de rencontre.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Collecte des informations</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Vos données de profil (nom, âge, photos, préférences)</li>
            <li>Votre position géographique en temps réel (géolocalisation obligatoire)</li>
            <li>Vos interactions avec l'application et les autres utilisateurs</li>
            <li>Données techniques (adresse IP, type d'appareil, système d'exploitation)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">2. Utilisation des données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Fournir et personnaliser le service de rencontre</li>
            <li>Afficher des profils à proximité de votre position</li>
            <li>Améliorer et optimiser l'application</li>
            <li>Prévenir les fraudes et assurer la sécurité</li>
            <li>Vous envoyer des notifications pertinentes</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. Partage des données</h2>
          <p>
            Votre position exacte n'est jamais partagée publiquement. Seules des indications de distance approximative sont visibles par les autres utilisateurs.
          </p>
          <p>Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec :</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Des prestataires techniques nécessaires au fonctionnement de l'application</li>
            <li>Les autorités légales en cas d'obligation juridique</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé ou toute utilisation abusive.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Conservation des données</h2>
          <p>
            Vos données sont conservées aussi longtemps que votre compte est actif. Vous pouvez demander la suppression de votre compte et de vos données à tout moment.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Vos droits</h2>
          <p>Conformément au RGPD, vous avez droit à :</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Accès à vos données personnelles</li>
            <li>Rectification des données inexactes</li>
            <li>Suppression de vos données</li>
            <li>Portabilité de vos données</li>
            <li>Limitation du traitement</li>
            <li>Opposition au traitement</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">7. Modifications</h2>
          <p>
            Nous pouvons mettre à jour cette politique occasionnellement. Nous vous informerons des changements significatifs.
          </p>

          <h2 className="text-xl font-semibold mt-6">8. Nous contacter</h2>
          <p>
            Pour toute question concernant cette politique ou vos données :<br />
            Email : privacy@matcha.com<br />
          </p>

          <p className="mt-8 italic">
            Date de dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;