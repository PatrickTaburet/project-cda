<?php

namespace App\Form;

use App\Entity\SceneD1;
use Symfony\Component\Form\{
    AbstractType,
    FormBuilderInterface
};
use Symfony\Component\{
    Validator\Constraints\NotBlank,
    OptionsResolver\OptionsResolver
};
use Symfony\Component\Form\Extension\Core\Type\{
    TextType,
    SubmitType,
    TextareaType
};
class SaveArtworkD1Type extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'constraints' => [
                    new NotBlank(),
                ],
                'attr' => [
                    'maxlength' => 36,
                ],
                'label' => 'Title',
            ])
            ->add('comment', TextareaType::class, [
                'label' => 'Comment',
                'attr' => [
                    'maxlength' => 255,
                ],
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Submit',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SceneD1::class,
        ]);
    }
}
