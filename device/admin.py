from django.contrib import admin

from django.contrib import admin
from .models import Device

class OrcaDeviceAdmin(admin.ModelAdmin):
    list_display = ('img_name', 'mgt_intf', 'mgt_ip','hwsku')

# Register your models here.

admin.site.register(Device, OrcaDeviceAdmin)