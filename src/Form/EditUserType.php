<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Vich\UploaderBundle\Form\Type\VichImageType;
use Symfony\Component\Validator\Constraints\Blank;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class EditUserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
       
        $builder
            ->add('pseudo', TextType::class,[
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => ' '
                ]
            ])
            ->add('email', EmailType::class,[
                'constraints' =>[
                    new NotBlank([
                        'message' => 'Please enter an email adress'
                    ])
                ],
                'required' => true,
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => ' '

                ]
            ])
           
            ->add('imageFile', VichImageType::class, [
                'label' => 'User picture',
                'allow_delete' => false, 
                'download_link' => false,
                'label_attr' => [
                    'class' => 'labelImg'
                ],
                'required' => false , // image is required only if the form is used for create
            ])
           
            -> add('Submit', SubmitType::class, [
                'label' => 'Update',
                'attr' => [
                    'class' => 'customButton',
                ],
            ])
        ;
        
        if ($options['is_admin']){
            $builder ->add('roles', ChoiceType::class, [
                'choices' => [
                    'User' => 'ROLE_USER',
                    'Artist' => 'ROLE_ARTIST',
                    'Admin' => 'ROLE_ADMIN'
                ],
                'expanded' => true,
                'multiple' => true,
                'label' => 'Roles'
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'is_admin' => false,
        ]);
    }
}
