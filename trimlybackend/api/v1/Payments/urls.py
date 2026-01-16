
from django.urls import path
from .views import ( 
    RegisterBankDetailsView,
    InitializePaymentView, 
    PaymentWebhookView, 
    TransferWebhookView,
    RequestWithdrawalView,

)

urlpatterns = [
    path('create_subaccounts/', RegisterBankDetailsView.as_view(), name='sub-account'),
    path('initialize/', InitializePaymentView.as_view(), name='init-payment'),
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
    path('withdraw/', RequestWithdrawalView.as_view(), name='withdraw-funds'),
    path('transfer-webhook/', TransferWebhookView.as_view(), name='transfer-webhook'),
    
]