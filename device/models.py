from django.db import models

class Device(models.Model):
    img_name = models.CharField(
        max_length=100,
    )
    
    mgt_intf = models.CharField(
        max_length=200,
        blank=True
    )
    
    mgt_ip = models.CharField(
        max_length=200,
        blank=True
    )
    
    hwsku = models.CharField(
        max_length=200,
        blank=True
    )
    
    mac = models.CharField(
        max_length=200,
    )
    
    platform = models.CharField(
        max_length=200,
        blank=True
    )
    
    type = models.CharField(
        max_length=200,
        blank=True
    )
   
    class Meta:
        verbose_name_plural = 'Devices'
        #unique_together = ['mac', 'mgt_ip']

    def __str__(self):
        return self.mgt_ip

    # def get_absolute_url(self):
    #     return reverse('plugins:orca_nb:orcadevice', args=[self.pk])