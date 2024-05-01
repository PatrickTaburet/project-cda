<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\SceneD1;
use App\Repository\SceneD1Repository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class DataSceneController extends AbstractController
{
    /**
     * @Route("/sceneD1", name="sceneD1")
     */
    public function sceneD1(): Response
    {
        return $this->render('data_scene/sceneD1.html.twig', [
            'controller_name' => 'DataSceneController',
        ]);
    }
    /**
    * @Route("/generative/newScene/{id}", name="newSceneD1", methods= {"GET"}))
    */
    public function newScene(SceneD1Repository $repo, SerializerInterface $serializer, $id): Response
    {
        $scene = $repo -> find($id); 

        // NORMALIZED + ENCODE METHOD :
        // //transform complex object in an associative array (only group sceneDataRecup to avoid infinite loop with the user entity)
        // $sceneNormalized = $normalizer->normalize($scene, null, ['groups'=> 'sceneDataRecup']);
        // // then encore into json format
        // $json = json_encode($sceneNormalized);

        // SERIALIZER METHOD :
        $json = $serializer->serialize($scene,'json',['groups'=> 'sceneDataRecup']);
            // Décoder le JSON en tableau associatif
        $sceneData = json_decode($json, true);
        return $this->render('data_scene/newSceneD1.html.twig', [
            'scene' => $sceneData,
        ]);   
    }
    
    /**
    * @Route("/dataScene/sendDataD1", name="send_data_D1", methods={"POST"})
    */
    public function sendDataToSceneD1(Request $request, EntityManagerInterface $entityManager, Security $security): Response
    {
        $randomness = $request->request->get('randomness');
        $looping = $request->request->get('looping');
        $abstract = $request->request->get('abstract');
        $country1 = $request->request->get('country1');
        $country2 = $request->request->get('country2');
        $country3 = $request->request->get('country3');
        $country4 = $request->request->get('country4');
        $country5 = $request->request->get('country5');
        $country6 = $request->request->get('country6');
        $country7 = $request->request->get('country7');
        $country8 = $request->request->get('country8');
        $userId = $request->request->get('userId');
        $imgFile = $request->request->get('file');
        
        
        // Decode the base64 string and save it as a .png file
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imgFile));

    
        // Créer un fichier temporaire à partir des données image
        $tempFile = tmpfile();

        // Écrire les données image dans le fichier temporaire
        fwrite($tempFile, $imageData);
        // Obtenir le chemin absolu du fichier temporaire
        $tempFilePath = stream_get_meta_data($tempFile)['uri'];
         // Get the image name
         $imageName = pathinfo($tempFilePath, PATHINFO_FILENAME) . '.png';
        // Créer un nouvel objet UploadedFile
        $imageFile = new UploadedFile($tempFilePath,  $imageName, 'image/png', null, true);
        $user = $security->getUser();

        // $user = $this->getDoctrine()
        // ->getRepository(User::class)
        // ->find($userId);
        
        if ($randomness !== null &&
            $looping !== null &&
            $abstract !== null &&
            $userId  !== null
            ) {
            $data = new SceneD1;
            $data ->setRandomness($randomness);
            $data ->setLooping($looping);
            $data ->setAbstract($abstract);
            $data ->setCountry1($country1);
            $data ->setCountry2($country2);
            $data ->setCountry3($country3);
            $data ->setCountry4($country4);
            $data ->setCountry5($country5);
            $data ->setCountry6($country6);
            $data ->setCountry7($country7);
            $data ->setCountry8($country8);
            $data ->setUser($user);
             // Lier l'image au fichier uploadé
            $data->setImageFile($imageFile);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($data);
            $entityManager->flush();

              // Supprimer le fichier temporaire
            fclose($tempFile);
            return new Response('Data successfully saved!', Response::HTTP_OK);
            // redirection managed in javascript
        } 
            return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);
        
    }

}
